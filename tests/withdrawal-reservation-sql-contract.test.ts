import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { describe, it } from "node:test";

describe("C4-V customer withdrawal reservation contract", () => {
  it("rolls back failed request stages and reserves once for concurrent same-key retries", () => {
    const temp=mkdtempSync(join(tmpdir(),"sgt-customer-c4v-")); const database=join(temp,"customer.sqlite");
    const script=String.raw`
import concurrent.futures,json,sqlite3,sys
p,*fs=sys.argv[1:]
for f in fs:
 d=sqlite3.connect(p);d.execute('PRAGMA foreign_keys=ON');d.executescript(open(f,encoding='utf8').read());d.commit();d.close()
n='2026-08-31T15:00:00Z'
def con():
 d=sqlite3.connect(p,timeout=10,isolation_level=None);d.execute('PRAGMA foreign_keys=ON');d.execute('PRAGMA busy_timeout=10000');return d
d=con()
def user(id,balance):d.execute("INSERT INTO users (id,email,password_hash,full_name,country,locale,tier,two_factor_enabled,cash_balance,created_at,updated_at) VALUES (?,?,'h','U','NG','en','Signature',0,?,?,?)",(id,id+'@x',balance,n,n))
def request(user_id,tx,key,stage=None):
 x=con()
 try:
  x.execute('BEGIN IMMEDIATE');x.execute("INSERT INTO transactions (id,user_id,kind,label,amount,status,note,method,withdrawal_code,created_at) SELECT ?,id,'withdrawal','Withdrawal Request',300,'pending','n','Bank',?,? FROM users WHERE id=? AND cash_balance>=300",(tx,'SGT-'+tx,n,user_id))
  if stage=='after_transaction': raise sqlite3.IntegrityError('synthetic after transaction')
  x.execute("UPDATE users SET cash_balance=cash_balance-(SELECT amount FROM transactions WHERE id=?),updated_at=? WHERE id=? AND EXISTS(SELECT 1 FROM transactions WHERE id=? AND user_id=users.id AND kind='withdrawal' AND status='pending')",(tx,n,user_id,tx))
  x.execute("INSERT INTO withdrawal_reservations (transaction_id,user_id,amount_snapshot,request_id_hash,source,reserved_at) SELECT id,user_id,amount,?,'customer_request',? FROM transactions WHERE id=? AND kind='withdrawal' AND status='pending'",(key,n,tx))
  if stage=='after_reservation': raise sqlite3.IntegrityError('synthetic after reservation')
  x.execute("INSERT INTO withdrawal_cases (transaction_id,user_id,review_status,reservation_state,created_at,updated_at,version) SELECT transaction_id,user_id,'awaiting_review','reserved',?,?,0 FROM withdrawal_reservations WHERE transaction_id=?",(n,n,tx))
  x.execute("INSERT INTO withdrawal_request_commits VALUES (?,CASE WHEN EXISTS(SELECT 1 FROM transactions WHERE id=? AND kind='withdrawal') AND EXISTS(SELECT 1 FROM withdrawal_reservations WHERE transaction_id=? AND request_id_hash=?) AND EXISTS(SELECT 1 FROM withdrawal_cases WHERE transaction_id=? AND reservation_state='reserved') THEN 1 ELSE 0 END,?)",(tx,tx,tx,key,tx,n));x.commit();return True
 except sqlite3.Error:x.rollback();return False
 finally:x.close()
def counts(user_id):return {'balance':d.execute('SELECT cash_balance FROM users WHERE id=?',(user_id,)).fetchone()[0],'transactions':d.execute("SELECT COUNT(*) FROM transactions WHERE user_id=? AND kind='withdrawal'",(user_id,)).fetchone()[0],'reservations':d.execute('SELECT COUNT(*) FROM withdrawal_reservations WHERE user_id=?',(user_id,)).fetchone()[0],'commits':d.execute("SELECT COUNT(*) FROM withdrawal_request_commits c JOIN transactions t ON t.id=c.transaction_id WHERE t.user_id=?",(user_id,)).fetchone()[0]}
user('fail-tx',1000);a=request('fail-tx','fail-tx','key-fail-tx','after_transaction');after_tx=counts('fail-tx')
user('fail-reserve',1000);b=request('fail-reserve','fail-reserve','key-fail-reserve','after_reservation');after_reserve=counts('fail-reserve')
user('double',1000)
with concurrent.futures.ThreadPoolExecutor(max_workers=10) as q: wins=sum(q.map(lambda i:request('double','double-'+str(i),'same-key'),range(10)))
double=counts('double');retry=request('double','retry','same-key');retry_counts=counts('double')
user('different',1000);first=request('different','different-a','key-a');second=request('different','different-b','key-b');different=counts('different')
print(json.dumps({'a':a,'after_tx':after_tx,'b':b,'after_reserve':after_reserve,'wins':wins,'double':double,'retry':retry,'retry_counts':retry_counts,'first':first,'second':second,'different':different}))`;
    try { const customer=process.cwd(); const admin=join(customer,"..","speedglobaltrade-admin"); const run=spawnSync("python",["-c",script,database,join(customer,"migrations","0001_initial.sql"),join(customer,"migrations","0004_add_withdrawal_code.sql"),join(admin,"migrations","0005_admin_control_plane.sql"),join(admin,"migrations","0006_admin_security_hardening.sql"),join(admin,"migrations","0007_deposit_review_and_settlement.sql"),join(admin,"migrations","0008_withdrawal_review_and_settlement.sql")],{encoding:"utf8"}); assert.equal(run.status,0,run.stderr); const data=JSON.parse(run.stdout); assert.equal(data.a,false);assert.deepEqual(data.after_tx,{balance:1000,transactions:0,reservations:0,commits:0});assert.equal(data.b,false);assert.deepEqual(data.after_reserve,{balance:1000,transactions:0,reservations:0,commits:0});assert.equal(data.wins,1);assert.deepEqual(data.double,{balance:700,transactions:1,reservations:1,commits:1});assert.equal(data.retry,false);assert.deepEqual(data.retry_counts,data.double);assert.equal(data.first,true);assert.equal(data.second,true);assert.deepEqual(data.different,{balance:400,transactions:2,reservations:2,commits:2}); } finally { rmSync(temp,{recursive:true,force:true}); }
  });
});
