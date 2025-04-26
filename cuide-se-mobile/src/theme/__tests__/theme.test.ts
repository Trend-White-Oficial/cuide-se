import { theme } from '../theme';

describe('Theme', () => {
  it('deve ter as cores primárias definidas', () => {
    expect(theme.colors.primary).toBeDefined();
    expect(theme.colors.primaryContainer).toBeDefined();
    expect(theme.colors.secondary).toBeDefined();
    expect(theme.colors.secondaryContainer).toBeDefined();
  });

  it('deve ter as cores de fundo definidas', () => {
    expect(theme.colors.background).toBeDefined();
    expect(theme.colors.surface).toBeDefined();
    expect(theme.colors.surfaceVariant).toBeDefined();
  });

  it('deve ter as cores de texto definidas', () => {
    expect(theme.colors.onPrimary).toBeDefined();
    expect(theme.colors.onSecondary).toBeDefined();
    expect(theme.colors.onSurface).toBeDefined();
    expect(theme.colors.onBackground).toBeDefined();
  });

  it('deve ter as cores de erro definidas', () => {
    expect(theme.colors.error).toBeDefined();
    expect(theme.colors.onError).toBeDefined();
    expect(theme.colors.errorContainer).toBeDefined();
  });

  it('deve ter as configurações de espaçamento definidas', () => {
    expect(theme.spacing).toBeDefined();
    expect(typeof theme.spacing.xs).toBe('number');
    expect(typeof theme.spacing.sm).toBe('number');
    expect(typeof theme.spacing.md).toBe('number');
    expect(typeof theme.spacing.lg).toBe('number');
    expect(typeof theme.spacing.xl).toBe('number');
  });

  it('deve ter as configurações de arredondamento definidas', () => {
    expect(theme.roundness).toBeDefined();
    expect(typeof theme.roundness).toBe('number');
  });

  it('deve ter as configurações de sombra definidas', () => {
    expect(theme.shadows).toBeDefined();
    expect(theme.shadows.small).toBeDefined();
    expect(theme.shadows.medium).toBeDefined();
    expect(theme.shadows.large).toBeDefined();
  });

  it('deve ter as configurações de cartão definidas', () => {
    expect(theme.cards).toBeDefined();
    expect(theme.cards.regular).toBeDefined();
    expect(theme.cards.elevated).toBeDefined();
  });
}); 