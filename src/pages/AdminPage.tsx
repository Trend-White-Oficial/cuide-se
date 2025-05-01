import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/admin/Sidebar';
import { Dashboard } from '@/components/admin/Dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { mockProfessionals, mockUsers, mockAppointments } from '@/data/mockData';
import { User, Professional, Appointment } from '@/types';
import { Search, Plus, Edit, Trash2, CheckCircle, XCircle, Clock, Bell } from 'lucide-react';

const AdminPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('users');
  const navigate = useNavigate();

  // Filtros para cada seção
  const [userFilter, setUserFilter] = useState('all');
  const [professionalFilter, setProfessionalFilter] = useState('all');
  const [appointmentFilter, setAppointmentFilter] = useState('all');

  // Função para filtrar usuários
  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Função para filtrar profissionais
  const filteredProfessionals = mockProfessionals.filter(professional => 
    professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    professional.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    professional.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Função para filtrar agendamentos
  const filteredAppointments = mockAppointments.filter(appointment => {
    const professional = mockProfessionals.find(p => p.id === appointment.professionalId);
    const user = mockUsers.find(u => u.id === appointment.clientId);
    
    return (
      (professional?.name.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (user?.name.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      appointment.date.includes(searchTerm) ||
      appointment.time.includes(searchTerm)
    );
  });

  // Função para obter o status do agendamento com ícone
  const getAppointmentStatus = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Concluído
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelado
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pendente
          </Badge>
        );
      case 'confirmed':
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Confirmado
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
              <p className="text-gray-500">Bem-vindo de volta, Admin</p>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100">
                <Bell className="h-5 w-5 text-gray-600" />
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button className="bg-pink hover:bg-pink/90">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar novo
              </Button>
            </div>
          </div>

          <Dashboard />

          <div className="mt-8">
            <Tabs defaultValue="users" className="w-full" onValueChange={setSelectedTab}>
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="users">Usuários</TabsTrigger>
                <TabsTrigger value="professionals">Profissionais</TabsTrigger>
                <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
              </TabsList>

              <TabsContent value="users">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Usuários</CardTitle>
                        <CardDescription>
                          Gerencie os usuários cadastrados na plataforma
                        </CardDescription>
                      </div>
                      <Select value={userFilter} onValueChange={setUserFilter}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Filtrar por tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="client">Clientes</SelectItem>
                          <SelectItem value="professional">Profissionais</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Telefone</TableHead>
                          <TableHead>Localização</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.phone || '-'}</TableCell>
                            <TableCell>{user.location}</TableCell>
                            <TableCell>
                              <Badge className={user.role === 'professional' ? 'bg-pink-light text-pink' : 'bg-blue-100 text-blue-800'}>
                                {user.role === 'professional' ? 'Profissional' : 'Cliente'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="professionals">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Profissionais</CardTitle>
                        <CardDescription>
                          Gerencie os profissionais cadastrados na plataforma
                        </CardDescription>
                      </div>
                      <Select value={professionalFilter} onValueChange={setProfessionalFilter}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Filtrar por especialidade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas especialidades</SelectItem>
                          <SelectItem value="Manicure">Manicure</SelectItem>
                          <SelectItem value="Cabeleireira">Cabeleireira</SelectItem>
                          <SelectItem value="Especialista em Cílios">Especialista em Cílios</SelectItem>
                          <SelectItem value="Podóloga">Podóloga</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Especialidade</TableHead>
                          <TableHead>Avaliação</TableHead>
                          <TableHead>Localização</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProfessionals.map((professional) => (
                          <TableRow key={professional.id}>
                            <TableCell className="font-medium">{professional.name}</TableCell>
                            <TableCell>{professional.email}</TableCell>
                            <TableCell>{professional.specialty}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <span className="mr-1">{professional.rating}</span>
                                <span className="text-gray-500">({professional.reviews.length} avaliações)</span>
                              </div>
                            </TableCell>
                            <TableCell>{professional.location}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="appointments">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Agendamentos</CardTitle>
                        <CardDescription>
                          Gerencie os agendamentos realizados na plataforma
                        </CardDescription>
                      </div>
                      <Select value={appointmentFilter} onValueChange={setAppointmentFilter}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Filtrar por status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos os status</SelectItem>
                          <SelectItem value="pending">Pendentes</SelectItem>
                          <SelectItem value="confirmed">Confirmados</SelectItem>
                          <SelectItem value="completed">Concluídos</SelectItem>
                          <SelectItem value="cancelled">Cancelados</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Profissional</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Horário</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAppointments.map((appointment) => {
                          const professional = mockProfessionals.find(p => p.id === appointment.professionalId);
                          const user = mockUsers.find(u => u.id === appointment.clientId);
                          
                          return (
                            <TableRow key={appointment.id}>
                              <TableCell className="font-medium">{user?.name || 'Cliente não encontrado'}</TableCell>
                              <TableCell>{professional?.name || 'Profissional não encontrado'}</TableCell>
                              <TableCell>{appointment.date}</TableCell>
                              <TableCell>{appointment.time}</TableCell>
                              <TableCell>{getAppointmentStatus(appointment.status)}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button variant="ghost" size="icon">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage; 