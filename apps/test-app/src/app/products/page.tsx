export default function Products() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Products Page</h1>
      <p>
        This is the products page. Notice that when you navigated here with
        scroll: false, the page didn't scroll to the top.
      </p>
      <a href="/" style={{ color: '#0070f3', textDecoration: 'underline' }}>
        ← Go back to home
      </a>
    </div>
  );
}
