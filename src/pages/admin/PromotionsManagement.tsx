
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
import { Search, Percent } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

// Mock data
const mockPromotions = [
  {
    id: '1',
    code: 'BEMVINDA10',
    description: 'Desconto de 10% para novas clientes',
    discount: 10,
    type: 'percentage',
    validUntil: '2023-12-31',
    active: true,
    useLimit: 100,
    usedCount: 23
  },
  {
    id: '2',
    code: 'VERAO25',
    description: 'Desconto de verão - 25% off',
    discount: 25,
    type: 'percentage',
    validUntil: '2023-06-30',
    active: true,
    useLimit: 50,
    usedCount: 12
  },
  {
    id: '3',
    code: 'MAES15',
    description: 'Dia das mães - 15% off',
    discount: 15,
    type: 'percentage',
    validUntil: '2023-05-15',
    active: false,
    useLimit: 200,
    usedCount: 187
  }
];

const PromotionsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [promotions, setPromotions] = useState(mockPromotions);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newPromotion, setNewPromotion] = useState({
    code: '',
    description: '',
    discount: '',
    validUntil: '',
    useLimit: '',
    applyToAll: true,
    selectedServices: []
  });
  const { toast } = useToast();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm) {
      setPromotions(mockPromotions);
      return;
    }
    
    const filtered = mockPromotions.filter(promo => 
      promo.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
      promo.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setPromotions(filtered);
  };
  
  const togglePromotionStatus = (id: string) => {
    setPromotions(promotions.map(promo => 
      promo.id === id 
        ? { ...promo, active: !promo.active } 
        : promo
    ));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPromotion(prev => ({ ...prev, [name]: value }));
  };

  const handleAddPromotion = (e: React.FormEvent) => {
    e.preventDefault();
    
    const id = (promotions.length + 1).toString();
    
    setPromotions([
      ...promotions,
      {
        id,
        code: newPromotion.code.toUpperCase(),
        description: newPromotion.description,
        discount: parseInt(newPromotion.discount),
        type: 'percentage',
        validUntil: newPromotion.validUntil,
        active: true,
        useLimit: parseInt(newPromotion.useLimit) || 100,
        usedCount: 0
      }
    ]);
    
    toast({
      title: "Promoção criada",
      description: `Cupom ${newPromotion.code.toUpperCase()} foi criado com sucesso.`
    });
    
    setNewPromotion({
      code: '',
      description: '',
      discount: '',
      validUntil: '',
      useLimit: '',
      applyToAll: true,
      selectedServices: []
    });
    
    setIsAddDialogOpen(false);
  };

  return (
    <AdminLayout title="Gerenciamento de Promoções">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <h2 className="text-2xl font-bold">Cupons e Promoções</h2>
          
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4">
            <form onSubmit={handleSearch} className="flex w-full sm:w-auto gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Buscar cupons..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button type="submit" variant="outline">Buscar</Button>
            </form>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-pink hover:bg-pink/90">Criar Novo Cupom</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Criar Novo Cupom</DialogTitle>
                  <DialogDescription>
                    Configure os detalhes do cupom promocional.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddPromotion}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="code">Código do Cupom</Label>
                        <Input
                          id="code"
                          name="code"
                          value={newPromotion.code}
                          onChange={handleInputChange}
                          className="uppercase"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="discount">Desconto (%)</Label>
                        <Input
                          id="discount"
                          name="discount"
                          type="number"
                          min="1"
                          max="100"
                          value={newPromotion.discount}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={newPromotion.description}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="validUntil">Válido até</Label>
                        <Input
                          id="validUntil"
                          name="validUntil"
                          type="date"
                          value={newPromotion.validUntil}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="useLimit">Limite de usos</Label>
                        <Input
                          id="useLimit"
                          name="useLimit"
                          type="number"
                          min="1"
                          value={newPromotion.useLimit}
                          onChange={handleInputChange}
                          placeholder="100"
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="applyToAll" 
                        checked={newPromotion.applyToAll}
                        onCheckedChange={(checked) => 
                          setNewPromotion(prev => ({ ...prev, applyToAll: checked === true }))
                        } 
                      />
                      <Label htmlFor="applyToAll">Aplicar a todos os serviços</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" className="bg-pink hover:bg-pink/90">Criar Cupom</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Percent className="mx-auto h-8 w-8 text-pink" />
                <h3 className="mt-2 font-semibold text-lg">Cupons Ativos</h3>
                <p className="text-3xl font-bold">{promotions.filter(p => p.active).length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Percent className="mx-auto h-8 w-8 text-pink" />
                <h3 className="mt-2 font-semibold text-lg">Total de Usos</h3>
                <p className="text-3xl font-bold">{promotions.reduce((sum, p) => sum + p.usedCount, 0)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Percent className="mx-auto h-8 w-8 text-pink" />
                <h3 className="mt-2 font-semibold text-lg">Desconto Médio</h3>
                <p className="text-3xl font-bold">
                  {Math.round(promotions.reduce((sum, p) => sum + p.discount, 0) / promotions.length)}%
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Desconto</TableHead>
                <TableHead>Validade</TableHead>
                <TableHead>Usos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promotions.length > 0 ? (
                promotions.map(promo => (
                  <TableRow key={promo.id}>
                    <TableCell className="font-medium">{promo.code}</TableCell>
                    <TableCell>{promo.description}</TableCell>
                    <TableCell>{promo.discount}%</TableCell>
                    <TableCell>{new Date(promo.validUntil).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{promo.usedCount} / {promo.useLimit}</TableCell>
                    <TableCell>
                      <Badge variant={promo.active ? 'default' : 'secondary'}>
                        {promo.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => togglePromotionStatus(promo.id)}
                        >
                          {promo.active ? 'Desativar' : 'Ativar'}
                        </Button>
                        <Button variant="outline" size="sm">Editar</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Nenhuma promoção encontrada.
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

export default PromotionsManagement;
