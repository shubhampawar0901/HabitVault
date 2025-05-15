import { type ReactNode } from 'react';

interface HomeLayoutProps {
  children: ReactNode;
}

const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <div className="home-layout">
      <header className="home-header">
        <h2>Application Header</h2>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/login">Login</a></li>
            <li><a href="/register">Register</a></li>
          </ul>
        </nav>
      </header>
      
      <main className="home-content">
        {children}
      </main>
      
      <footer className="home-footer">
        <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomeLayout;
