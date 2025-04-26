
import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, XCircle } from 'lucide-react';

const AssetsManagement = () => {
  const [logoPreview, setLogoPreview] = useState('/placeholder.svg');
  const [bannerPreview, setBannerPreview] = useState('/placeholder.svg');
  const [galleryImages, setGalleryImages] = useState<string[]>([
    '/placeholder.svg', 
    '/placeholder.svg'
  ]);
  const { toast } = useToast();

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      toast({
        title: "Logo alterado",
        description: "O novo logo foi carregado com sucesso."
      });
    }
  };

  const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      toast({
        title: "Banner alterado",
        description: "O novo banner foi carregado com sucesso."
      });
    }
  };

  const handleGalleryImageAdd = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setGalleryImages([...galleryImages, reader.result as string]);
      };
      reader.readAsDataURL(file);
      
      toast({
        title: "Imagem adicionada",
        description: "A imagem foi adicionada à galeria com sucesso."
      });
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
    
    toast({
      title: "Imagem removida",
      description: "A imagem foi removida da galeria com sucesso."
    });
  };

  return (
    <AdminLayout title="Gerenciamento de Imagens">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Imagens e Assets</h2>
        
        <Tabs defaultValue="logo">
          <TabsList className="mb-4">
            <TabsTrigger value="logo">Logo</TabsTrigger>
            <TabsTrigger value="banner">Banner Principal</TabsTrigger>
            <TabsTrigger value="gallery">Galeria de Imagens</TabsTrigger>
          </TabsList>
          
          <TabsContent value="logo">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Logo Atual</h3>
                  <div className="bg-gray-100 p-6 flex items-center justify-center rounded-lg">
                    <img 
                      src={logoPreview} 
                      alt="Logo atual" 
                      className="max-h-32 object-contain" 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="logo-upload">Carregar Novo Logo</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Formatos recomendados: PNG, SVG. Tamanho máximo: 2MB.
                  </p>
                </div>
                
                <div className="pt-4">
                  <Button className="bg-pink hover:bg-pink/90">Salvar Alterações</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="banner">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Banner Atual</h3>
                  <div className="bg-gray-100 p-6 flex items-center justify-center rounded-lg">
                    <img 
                      src={bannerPreview} 
                      alt="Banner atual" 
                      className="max-h-64 w-full object-cover rounded" 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="banner-upload">Carregar Novo Banner</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="banner-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleBannerChange}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Tamanho recomendado: 1920x480px. Formato: JPG, PNG. Tamanho máximo: 5MB.
                  </p>
                </div>
                
                <div className="pt-4">
                  <Button className="bg-pink hover:bg-pink/90">Salvar Alterações</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="gallery">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-semibold mb-2">Galeria de Imagens</h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {galleryImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={img} 
                        alt={`Galeria imagem ${index + 1}`} 
                        className="aspect-square object-cover rounded-lg border" 
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <XCircle className="h-5 w-5 text-red-500" />
                      </button>
                    </div>
                  ))}
                  
                  <label 
                    htmlFor="gallery-upload" 
                    className="cursor-pointer flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-pink text-gray-500 hover:text-pink transition-colors"
                  >
                    <Upload className="h-8 w-8 mb-2" />
                    <span className="text-sm">Adicionar Imagem</span>
                    <Input
                      id="gallery-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleGalleryImageAdd}
                    />
                  </label>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Formatos aceitos: JPG, PNG. Tamanho máximo: 5MB por imagem.
                </p>
                
                <div className="pt-4">
                  <Button className="bg-pink hover:bg-pink/90">Salvar Alterações</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AssetsManagement;
