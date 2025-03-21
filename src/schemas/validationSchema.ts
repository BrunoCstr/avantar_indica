import { z } from 'zod';

// Validação do Formulário de Cadastro
export const signUpSchema = z.object({
  fullName: z.string().min(3, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  cpf: z.string().min(11, "Digite um CPF válido!").max(11, "Digite um CPF válido!").regex(/^\d{11}$/, "CPF deve conter apenas números"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  affiliated_to: z.string().min(5, "Selecione uma unidade para se afiliar"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas devem ser iguais!",
  path:["password"]
})

export type SignUpFormData = z.infer<typeof signUpSchema>;


// Validação do Formulário de Login
export const signInSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres")
})

export type SignInFormData = z.infer<typeof signInSchema>;