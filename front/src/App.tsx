import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'http://localhost:3000'; // Ajuste conforme necessário

interface User {
  id: number;
  name: string;
  email: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      setUsers(response.data);
    } catch (err: any) {
      console.error('Erro ao buscar usuários:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email) {
      setError('Preencha todos os campos!');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await axios.post(`${API_BASE_URL}/users`, {
        name,
        email
      });

      setSuccess('Usuário cadastrado com sucesso! ✅');
      setName('');
      setEmail('');
      fetchUsers(); // Atualiza a lista
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao cadastrar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1>👥 Sistema de Cadastro de Usuários</h1>

        <div className="section">
          <h2>📝 Cadastrar Novo Usuário</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nome:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite o nome do usuário"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite o email do usuário"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="alert alert-error">
                ❌ {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success">
                {success}
              </div>
            )}

            <button type="submit" disabled={loading}>
              {loading ? '⏳ Cadastrando...' : '➕ Cadastrar Usuário'}
            </button>
          </form>
        </div>

        <div className="section">
          <div className="section-header">
            <h2>📋 Usuários Cadastrados</h2>
            <button className="btn-refresh" onClick={fetchUsers}>
              🔄 Atualizar
            </button>
          </div>

          {users.length === 0 ? (
            <div className="empty-state">
              <p>📭 Nenhum usuário cadastrado ainda</p>
            </div>
          ) : (
            <div className="users-list">
              {users.map((user) => (
                <div key={user.id} className="user-card">
                  <div className="user-avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-info">
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                  </div>
                  <div className="user-id">
                    <span>ID: {user.id}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
