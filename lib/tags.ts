export function normalizeTags(value: string[] | string | null | undefined): string[] {
  const values = Array.isArray(value) ? value : [value ?? ''];

  return Array.from(
    new Set(
      values
        .join(',')
        .replace(/[{}]/g, '')
        .split(',')
        .map((tag) => tag.replace(/^["']|["']$/g, '').trim())
        .filter(Boolean)
    )
  );
}
