// Componente AppointmentsPage
// Página administrativa para gerenciar agendamentos da plataforma
import { useState } from 'react';
import { Sidebar } from '@/components/admin/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Calendar, Check, X, Clock } from 'lucide-react';
import { mockAppointments } from '@/data/mockData';

const AppointmentsPage = () => {
  // Estados do componente
  const [searchTerm, setSearchTerm] = useState(''); // Termo de busca
  const [statusFilter, setStatusFilter] = useState('all'); // Filtro de status

  // Filtra agendamentos com base no termo de busca
  const filteredAppointments = mockAppointments.filter(appointment => 
    appointment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.professionalName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Retorna o badge correspondente ao status do agendamento
  const getStatusBadge = (status: string) => {
    const statusMap = {
      confirmed: { class: 'bg-green-100 text-green-800', text: 'Confirmado' },
      pending: { class: 'bg-yellow-100 text-yellow-800', text: 'Pendente' },
      cancelled: { class: 'bg-red-100 text-red-800', text: 'Cancelado' },
      completed: { class: 'bg-blue-100 text-blue-800', text: 'Concluído' }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.pending;
  };

  // Formata data e hora para exibição
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Cabeçalho da página */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Agendamentos</h1>
              <p className="text-gray-500">Gerencie os agendamentos da plataforma</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar agendamentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button className="bg-pink hover:bg-pink/90">
                <Calendar className="h-4 w-4 mr-2" />
                Novo Agendamento
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Lista de Agendamentos</CardTitle>
                  <CardDescription>
                    Total de {filteredAppointments.length} agendamentos encontrados
                  </CardDescription>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="confirmed">Confirmados</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                    <SelectItem value="cancelled">Cancelados</SelectItem>
                    <SelectItem value="completed">Concluídos</SelectItem>
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
                    <TableHead>Data e Hora</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">{appointment.clientName}</TableCell>
                      <TableCell>{appointment.professionalName}</TableCell>
                      <TableCell>{formatDate(appointment.date)}</TableCell>
                      <TableCell>{appointment.service}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(appointment.status).class}>
                          {getStatusBadge(appointment.status).text}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {appointment.status === 'pending' && (
                            <>
                              <Button variant="ghost" size="icon" className="text-green-500 hover:text-green-700">
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {appointment.status === 'confirmed' && (
                            <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-700">
                              <Clock className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage; 