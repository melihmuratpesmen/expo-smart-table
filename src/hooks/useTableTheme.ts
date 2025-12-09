import { useMemo } from 'react';
import { lightTheme, darkTheme, TableTheme } from '../theme/tokens';

export function useTableTheme(
    theme: 'light' | 'dark' = 'light',
    themeConfig?: Partial<TableTheme>
): TableTheme {
    const baseTheme = theme === 'dark' ? darkTheme : lightTheme;

    return useMemo(() => {
        if (themeConfig) {
            return { ...baseTheme, ...themeConfig };
        }
        return baseTheme;
    }, [baseTheme, themeConfig]);
}
