import { lazy } from 'react';

export const lazyLoadComponent = (importFunc: () => Promise<any>) => {
  return lazy(importFunc);
};

export const dynamicImport = async (path: string) => {
  try {
    const module = await import(path);
    return module;
  } catch (error) {
    console.error('Erro ao importar módulo dinamicamente:', error);
    return null;
  }
}; 