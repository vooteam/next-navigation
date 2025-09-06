export default function Login() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Login Page</h1>
      <p>
        This is the login page. This was reached using navigation.replace(), so
        using the back button won't take you to the previous page.
      </p>
      <a href="/" style={{ color: '#0070f3', textDecoration: 'underline' }}>
        ← Go back to home
      </a>
    </div>
  );
}
