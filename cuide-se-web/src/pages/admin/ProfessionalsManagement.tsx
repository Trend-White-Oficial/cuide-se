
import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Search, Star } from 'lucide-react';

// Mock data
const mockProfessionals = [
  { 
    id: '1', 
    name: 'Carla Oliveira', 
    specialty: 'Cabeleireira', 
    email: 'carla.oliveira@email.com', 
    phone: '(11) 97777-3333',
    rating: 4.8,
    status: 'active',
    clients: 45
  },
  { 
    id: '2', 
    name: 'Fernanda Costa', 
    specialty: 'Manicure', 
    email: 'fernanda.costa@email.com', 
    phone: '(11) 95555-5555',
    rating: 4.5,
    status: 'active',
    clients: 32
  },
  { 
    id: '3', 
    name: 'Juliana Mendes', 
    specialty: 'Esteticista', 
    email: 'juliana.mendes@email.com', 
    phone: '(11) 94444-6666',
    rating: 4.9,
    status: 'active',
    clients: 38
  },
  { 
    id: '4', 
    name: 'Roberta Alves', 
    specialty: 'Maquiadora', 
    email: 'roberta.alves@email.com', 
    phone: '(11) 93333-7777',
    rating: 4.2,
    status: 'inactive',
    clients: 12
  },
];

const ProfessionalsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [professionals, setProfessionals] = useState(mockProfessionals);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProfessional, setNewProfessional] = useState({
    name: '',
    specialty: '',
    email: '',
    phone: '',
    bio: ''
  });
  const { toast } = useToast();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm) {
      setProfessionals(mockProfessionals);
      return;
    }
    
    const filtered = mockProfessionals.filter(pro => 
      pro.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      pro.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setProfessionals(filtered);
  };
  
  const toggleProfessionalStatus = (id: string) => {
    setProfessionals(professionals.map(pro => 
      pro.id === id 
        ? { ...pro, status: pro.status === 'active' ? 'inactive' : 'active' } 
        : pro
    ));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProfessional(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProfessional = (e: React.FormEvent) => {
    e.preventDefault();
    
    const id = (professionals.length + 1).toString();
    
    setProfessionals([
      ...professionals,
      {
        id,
        name: newProfessional.name,
        specialty: newProfessional.specialty,
        email: newProfessional.email,
        phone: newProfessional.phone,
        rating: 0,
        status: 'active',
        clients: 0
      }
    ]);
    
    toast({
      title: "Profissional adicionado",
      description: `${newProfessional.name} foi adicionado com sucesso.`
    });
    
    setNewProfessional({
      name: '',
      specialty: '',
      email: '',
      phone: '',
      bio: ''
    });
    
    setIsAddDialogOpen(false);
  };

  return (
    <AdminLayout title="Gerenciamento de Profissionais">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <h2 className="text-2xl font-bold">Profissionais</h2>
          
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4">
            <form onSubmit={handleSearch} className="flex w-full sm:w-auto gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Buscar profissionais..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button type="submit" variant="outline">Buscar</Button>
            </form>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-pink hover:bg-pink/90">Adicionar Profissional</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Profissional</DialogTitle>
                  <DialogDescription>
                    Preencha os detalhes do profissional. O profissional receberá um e-mail para definir sua senha.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddProfessional}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Nome completo</Label>
                      <Input
                        id="name"
                        name="name"
                        value={newProfessional.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="specialty">Especialidade</Label>
                      <Input
                        id="specialty"
                        name="specialty"
                        value={newProfessional.specialty}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={newProfessional.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={newProfessional.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="bio">Bio/Descrição</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={newProfessional.bio}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" className="bg-pink hover:bg-pink/90">Adicionar</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Especialidade</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Avaliação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {professionals.length > 0 ? (
                professionals.map(pro => (
                  <TableRow key={pro.id}>
                    <TableCell className="font-medium">{pro.name}</TableCell>
                    <TableCell>{pro.specialty}</TableCell>
                    <TableCell>
                      <div>
                        <div>{pro.email}</div>
                        <div className="text-sm text-muted-foreground">{pro.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1 fill-yellow-400" />
                        <span>{pro.rating} ({pro.clients} clientes)</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={pro.status === 'active' ? 'default' : 'destructive'}>
                        {pro.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toggleProfessionalStatus(pro.id)}
                        >
                          {pro.status === 'active' ? 'Desativar' : 'Ativar'}
                        </Button>
                        <Button variant="outline" size="sm">Editar</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Nenhum profissional encontrado.
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

export default ProfessionalsManagement;
