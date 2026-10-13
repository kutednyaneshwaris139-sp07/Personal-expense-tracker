import { useMemo, useState } from 'react';
import { Wallet, TrendingUp, CalendarDays, Plus, Trash2, Search, ReceiptText, ArrowDownRight } from 'lucide-react';

const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Education', 'Entertainment', 'Other'];
const seed = [
  { id: 1, title: 'Groceries', amount: 850, category: 'Food', date: '2026-10-11', note: 'Weekly groceries' },
  { id: 2, title: 'Bus pass', amount: 450, category: 'Transport', date: '2026-10-10', note: '' },
  { id: 3, title: 'Notebook', amount: 180, category: 'Education', date: '2026-10-08', note: 'College supplies' },
  { id: 4, title: 'Mobile recharge', amount: 299, category: 'Bills', date: '2026-10-06', note: '' }
];
const money = n => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
const today = new Date().toISOString().slice(0, 10);

export default function App() {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('expense-items')) || seed; } catch { return seed; }
  });
  const [form, setForm] = useState({ title: '', amount: '', category: 'Food', date: today, note: '' });
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [month, setMonth] = useState(today.slice(0, 7));
  const [error, setError] = useState('');

  const save = next => {
    setItems(next);
    localStorage.setItem('expense-items', JSON.stringify(next));
  };
  const monthItems = useMemo(() => items.filter(x => x.date.startsWith(month)), [items, month]);
  const visibleItems = useMemo(() => monthItems.filter(x =>
    (filter === 'All' || x.category === filter) &&
    (x.title + ' ' + x.category + ' ' + x.note).toLowerCase().includes(query.toLowerCase())
  ).sort((a, b) => b.date.localeCompare(a.date)), [monthItems, filter, query]);

  const total = monthItems.reduce((s, x) => s + Number(x.amount), 0);
  const average = monthItems.length ? total / monthItems.length : 0;
  const categoryTotals = categories.map(category => ({
    category,
    amount: monthItems.filter(x => x.category === category).reduce((s, x) => s + Number(x.amount), 0)
  })).filter(x => x.amount > 0).sort((a, b) => b.amount - a.amount);
  const maxCategory = Math.max(...categoryTotals.map(x => x.amount), 1);
  const recentTotal = items.filter(x => x.date >= new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10))
    .reduce((s, x) => s + Number(x.amount), 0);

  function addExpense(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.amount || Number(form.amount) <= 0 || !form.date) {
      setError('Enter a title, a valid amount, and a date.');
      return;
    }
    const next = [{ ...form, id: Date.now(), amount: Number(form.amount), title: form.title.trim() }, ...items];
    save(next);
    setForm({ title: '', amount: '', category: 'Food', date: today, note: '' });
    setError('');
  }
  function removeExpense(id) {
    if (window.confirm('Delete this expense?')) save(items.filter(x => x.id !== id));
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-icon"><Wallet size={21}/></div><span>Pennywise</span></div>
      <div className="side-label">WORKSPACE</div>
      <div className="nav-item active"><ReceiptText size={18}/> Expense overview</div>
      <div className="side-tip"><div className="tip-icon"><TrendingUp size={18}/></div><b>Small steps add up.</b><p>Track your spending to understand where your money goes.</p></div>
      <div className="sidebar-footer"><div className="avatar">P</div><div><b>Personal account</b><small>Local device storage</small></div></div>
    </aside>

    <main className="main">
      <header className="topbar"><div><p className="eyebrow">YOUR MONEY, AT A GLANCE</p><h1>Expense overview</h1><p className="subheading">A clearer picture of your everyday spending.</p></div>
        <label className="month-picker"><CalendarDays size={17}/><input type="month" value={month} onChange={e => setMonth(e.target.value)} aria-label="Choose month"/></label>
      </header>

      <section className="summary-grid">
        <article className="summary-card primary"><div className="card-top"><span>Total this month</span><span className="metric-icon"><Wallet size={18}/></span></div><div className="metric">{money(total)}</div><div className="metric-foot"><span className="dot"></span>{monthItems.length} transaction{monthItems.length === 1 ? '' : 's'} recorded</div></article>
        <article className="summary-card"><div className="card-top"><span>Average expense</span><span className="metric-icon green"><TrendingUp size={18}/></span></div><div className="metric">{money(average)}</div><div className="metric-foot muted">Per transaction this month</div></article>
        <article className="summary-card"><div className="card-top"><span>Last 7 days</span><span className="metric-icon orange"><ArrowDownRight size={18}/></span></div><div className="metric">{money(recentTotal)}</div><div className="metric-foot muted">Across all recorded expenses</div></article>
      </section>

      <section className="content-grid">
        <article className="panel add-panel"><div className="panel-heading"><div><h2>Add an expense</h2><p>Record a purchase or payment.</p></div><span className="round-plus"><Plus size={19}/></span></div>
          <form onSubmit={addExpense}>
            <label>Expense name<input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Lunch, books, travel" /></label>
            <div className="form-row"><label>Amount (₹)<input type="number" min="1" step="0.01" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} placeholder="0.00" /></label>
            <label>Category<select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>{categories.map(c => <option key={c}>{c}</option>)}</select></label></div>
            <label>Date<input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></label>
            <label>Note <span className="optional">(optional)</span><input value={form.note} onChange={e => setForm({...form, note: e.target.value})} placeholder="Add a short note" /></label>
            {error && <p className="error">{error}</p>}
            <button className="submit-btn" type="submit"><Plus size={17}/> Add expense</button>
          </form>
        </article>

        <article className="panel analysis-panel"><div className="panel-heading"><div><h2>Spending by category</h2><p>Where your money went in {month}.</p></div></div>
          {categoryTotals.length ? <div className="category-list">{categoryTotals.map((item, i) => <div className="category-row" key={item.category}><div className="category-info"><span className={'category-dot dot-' + (i % 6)}></span><span>{item.category}</span><b>{money(item.amount)}</b></div><div className="bar-track"><div className={'bar-fill fill-' + (i % 6)} style={{width: `${item.amount / maxCategory * 100}%`}}/></div><div className="category-percent">{Math.round(item.amount / total * 100)}% of monthly spending</div></div>)}</div>
          : <div className="empty-chart"><div className="empty-icon"><TrendingUp size={24}/></div><b>No spending to analyze yet</b><p>Add an expense for this month to see the breakdown.</p></div>}
          <div className="analysis-footer"><span>Total categorized spending</span><b>{money(total)}</b></div>
        </article>
      </section>

      <section className="panel transactions-panel"><div className="panel-heading transaction-heading"><div><h2>Recent transactions</h2><p>Review and manage your expenses.</p></div><span className="count-pill">{visibleItems.length} entries</span></div>
        <div className="table-tools"><div className="search-box"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search expenses..." /></div><select className="filter-select" value={filter} onChange={e => setFilter(e.target.value)} aria-label="Filter by category"><option>All</option>{categories.map(c => <option key={c}>{c}</option>)}</select></div>
        {visibleItems.length ? <div className="table-wrap"><table><thead><tr><th>EXPENSE</th><th>CATEGORY</th><th>DATE</th><th>AMOUNT</th><th></th></tr></thead><tbody>{visibleItems.map(x => <tr key={x.id}><td><div className="expense-cell"><span className="expense-icon">{x.category === 'Food' ? '🍲' : x.category === 'Transport' ? '🚌' : x.category === 'Shopping' ? '🛍️' : x.category === 'Bills' ? '🧾' : x.category === 'Health' ? '💊' : x.category === 'Education' ? '📚' : x.category === 'Entertainment' ? '🎬' : '📌'}</span><div><b>{x.title}</b>{x.note && <small>{x.note}</small>}</div></div></td><td><span className="category-tag">{x.category}</span></td><td className="date-cell">{new Date(x.date + 'T12:00:00').toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'})}</td><td className="amount-cell">{money(Number(x.amount))}</td><td><button className="delete-btn" onClick={() => removeExpense(x.id)} title="Delete expense" aria-label={'Delete ' + x.title}><Trash2 size={16}/></button></td></tr>)}</tbody></table></div>
        : <div className="empty-table"><ReceiptText size={25}/><b>No matching expenses</b><span>Try a different search or add a new expense.</span></div>}
      </section>
      <footer className="footer">Made for mindful spending <span>•</span> Your data stays in this browser</footer>
    </main>
  </div>;
}