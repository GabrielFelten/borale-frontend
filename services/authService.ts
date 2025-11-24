const baseUrl = "https://boralebackend.onrender.com";

export async function login(email: string, password: string) {
    const params = new URLSearchParams({ email, pass: password });

    const response = await fetch(
        `${baseUrl}/api/Login/Login?${params.toString()}`
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Erro no login");
    return data;
}

export async function signup(payload: any) {
    const response = await fetch(`${baseUrl}/api/Login/UpsertUser`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Accept": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Erro no cadastro");
    return data;
}

export type ValidationMode = "login" | "signup" | "update";
export function validateSignup(data: {
    name: string;
    email: string;
    password: string;
    contato: string;
    tipo: string;
    cttPublico: boolean;
    cep: string;
    rua: string;
    numero: string;
    bairro: string;
}, mode: ValidationMode) {
    // Validações comuns
    if (!data.email) return "Por favor, preencha o e-mail";
    if (!data.email.includes("@")) return "Insira um e-mail válido";

    // Senha obrigatória somente no login e signup
    if ((mode === "login" || mode === "signup")) {
        if (!data.password) return "Por favor, preencha a senha";
        if (data.password.length < 6)
            return "A senha deve ter pelo menos 6 caracteres";
    }

    // Signup e update exigem dados adicionais
    if (mode === "signup" || mode === "update") {
        if (!data.name) return "Por favor, preencha o nome";        
        if (!data.tipo) return "Informe Pessoa Física ou Pessoa Jurídica";

        if (data.tipo === "PF") {
            if (!data.cttPublico)
                return "Você precisa concordar em compartilhar seus dados";

            if (!data.contato) return "Por favor, preencha o contato";
        }

        if (data.tipo === "PJ") {
            if (!data.cep) return "Por favor, preencha o CEP";
            if (!data.rua) return "Por favor, preencha a rua";
            if (!data.numero) return "Por favor, preencha o número";
            if (!data.bairro) return "Por favor, preencha o bairro";

            if (!data.contato && data.cttPublico) 
                return "Por favor, preencha o contato";
        }
    }

    return null;
}