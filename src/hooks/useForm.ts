
import { useForm as useHookForm, type UseFormProps, type FieldValues, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodSchema } from 'zod';

export function useForm<TFieldValues extends FieldValues = FieldValues>(
  schema: ZodSchema<TFieldValues>,
  options?: Omit<UseFormProps<TFieldValues>, 'resolver'>
): UseFormReturn<TFieldValues> {
  return useHookForm<TFieldValues>({
    resolver: zodResolver(schema),
    ...options,
  });
}
