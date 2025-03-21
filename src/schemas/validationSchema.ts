import { z } from 'zod';

export const signUpSchema = z.object({
  fullName: z.string().min(3, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  cpf: z.string().min(11, "Digite um CPF válido!").max(11, "Digite um CPF válido!").regex(/^\d{11}$/, "CPF deve conter apenas números"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(6, "As senhas devem ser iguais!"),
  affiliated_to: z.string().min(5, "Selecione uma unidade para se afiliar"),
});

// Inferindo o tipo para o formulário:
export type SignUpFormData = z.infer<typeof signUpSchema>;
