
import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';

// Mock data
const mockUsers = [
  { id: '1', name: 'Ana Maria Silva', email: 'ana.silva@email.com', phone: '(11) 99999-1111', role: 'client', status: 'active', lastActive: '2023-04-20' },
  { id: '2', name: 'João Paulo Santos', email: 'joao.santos@email.com', phone: '(11) 98888-2222', role: 'client', status: 'active', lastActive: '2023-04-19' },
  { id: '3', name: 'Carla Oliveira', email: 'carla.oliveira@email.com', phone: '(11) 97777-3333', role: 'professional', status: 'active', lastActive: '2023-04-21' },
  { id: '4', name: 'Ricardo Martins', email: 'ricardo.martins@email.com', phone: '(11) 96666-4444', role: 'client', status: 'inactive', lastActive: '2023-03-15' },
  { id: '5', name: 'Fernanda Costa', email: 'fernanda.costa@email.com', phone: '(11) 95555-5555', role: 'professional', status: 'active', lastActive: '2023-04-18' },
];

const UsersManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState(mockUsers);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm) {
      setUsers(mockUsers);
      return;
    }
    
    const filtered = mockUsers.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setUsers(filtered);
  };
  
  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' } 
        : user
    ));
  };

  return (
    <AdminLayout title="Gerenciamento de Usuários">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <h2 className="text-2xl font-bold">Usuários</h2>
          
          <form onSubmit={handleSearch} className="flex w-full sm:w-auto gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Buscar usuários..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button type="submit" variant="outline">Buscar</Button>
          </form>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length > 0 ? (
                users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'professional' ? 'secondary' : 'outline'}>
                        {user.role === 'professional' ? 'Profissional' : 'Cliente'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                        {user.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toggleUserStatus(user.id)}
                        >
                          {user.status === 'active' ? 'Desativar' : 'Ativar'}
                        </Button>
                        <Button variant="outline" size="sm">Editar</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Nenhum usuário encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UsersManagement;
