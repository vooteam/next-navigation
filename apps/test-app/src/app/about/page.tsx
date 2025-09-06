export default function About() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>About Page</h1>
      <p>
        This is the about page. You can navigate back using the browser back
        button or the navigation.back() method.
      </p>
      <a href="/" style={{ color: '#0070f3', textDecoration: 'underline' }}>
        ← Go back to home
      </a>
    </div>
  );
}
