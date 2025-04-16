import { z } from 'zod';

// Validação do Formulário de Cadastro
export const signUpSchema = z.object({
  fullName: z.string().min(3, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
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


// Validação do Formulário de Esqueci minha senha
export const forgotPasswordSchema = z.object({
  email: z.string().email("E-mail inválido"),
})

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;


// Validação do envio da indicação
export const indicationSchema = z.object({
  fullName: z.string().min(3, "Nome é obrigatório"),
  phone: z.string().min(14, "Digite um telefone válido!").max(15, "Digite um telefone válido!").regex(/^\(\d{2}\)\s?\d{4,5}-\d{4}$/, "Formato de telefone inválido!"),
  product: z.string().min(3, "Selecione um produto"),
  observations: z.string().min(1, "Digite uma observação")
})

export type IndicationSchema = z.infer<typeof indicationSchema>;

