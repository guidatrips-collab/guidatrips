import React, { useState } from "react";
import { firestoreService } from "../firebase";
import { ClientUser } from "../types";
import { X, Mail, Lock, User, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";

interface ClientAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: ClientUser) => void;
  title?: string;
  subtitle?: string;
}

export default function ClientAuthModal({ isOpen, onClose, onSuccess, title, subtitle }: ClientAuthModalProps) {
  const [tab, setTab] = useState<"login" | "register">("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch all registered users
      const users = await firestoreService.getAll<any>("users");
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!foundUser) {
        setError("Nenhuma conta encontrada com este e-mail.");
        setLoading(false);
        return;
      }

      if (foundUser.password !== password) {
        setError("Senha incorreta. Tente novamente.");
        setLoading(false);
        return;
      }

      // Successful login
      const clientUser: ClientUser = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        phone: foundUser.phone || "",
        photoUrl: foundUser.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(foundUser.name)}`,
        preferences: foundUser.preferences || [],
        favorites: foundUser.favorites || []
      };

      setSuccess(`Bem-vindo(a) de volta, ${foundUser.name.split(" ")[0]}!`);
      setTimeout(() => {
        onSuccess(clientUser);
        onClose();
      }, 1000);

    } catch (err) {
      console.error("Erro no login:", err);
      setError("Ocorreu um erro ao tentar fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve conter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Check if email already registered
      const users = await firestoreService.getAll<any>("users");
      const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());

      if (emailExists) {
        setError("Este e-mail já está cadastrado. Tente fazer login.");
        setLoading(false);
        return;
      }

      // Create new user in Firestore
      const userId = `user-${Date.now()}`;
      const newUser = {
        id: userId,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: password, // simple storage as per instructions
        phone: "",
        photoUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
        preferences: [],
        favorites: [],
        createdAt: new Date().toISOString()
      };

      await firestoreService.set("users", userId, newUser);

      // Create lead automatically in Firestore CRM for lead capture metrics!
      const leadId = `lead-reg-${Date.now()}`;
      const regLead = {
        id: leadId,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: "Não cadastrado",
        experienceInterest: [],
        groupSize: 1,
        origin: "formulario" as const,
        status: "novo" as const,
        notes: [`Conta criada na plataforma pelo cliente.`],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await firestoreService.set("leads", leadId, regLead);

      const clientUser: ClientUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        photoUrl: newUser.photoUrl,
        preferences: newUser.preferences,
        favorites: newUser.favorites
      };

      setSuccess("Conta criada com sucesso! Redirecionando...");
      setTimeout(() => {
        onSuccess(clientUser);
        onClose();
      }, 1000);

    } catch (err) {
      console.error("Erro no cadastro:", err);
      setError("Ocorreu um erro ao registrar a conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0d1b2a]/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      {/* Container */}
      <div 
        id="auth-modal"
        className="relative bg-[#FBF9F6] border border-zinc-200/50 w-full max-w-md rounded-2xl shadow-[0_20px_50px_rgba(13,27,42,0.25)] overflow-hidden flex flex-col max-h-[90vh] animate-fade-in"
      >
        {/* Upper Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#E8711A] to-[#FF8A3F]"></div>

        {/* Header */}
        <div className="p-6 pb-4 flex items-start justify-between border-b border-zinc-100">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#0D1B2A]">
              {title || (tab === "register" ? "Acesse Recursos Exclusivos" : "Bem-vindo de Volta")}
            </h3>
            <p className="font-sans text-xs text-[#5C6874] mt-1 leading-relaxed">
              {subtitle || (tab === "register" ? "Crie sua conta para construir seu roteiro, salvar viagens e acessar o dashboard." : "Faça login para gerenciar suas viagens e consultar seus roteiros.")}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-zinc-100 rounded-lg text-[#8A96A3] hover:text-[#0D1B2A] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-zinc-100 bg-zinc-50 font-accent text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => { setTab("register"); setError(null); setSuccess(null); }}
            className={`flex-1 py-3 text-center border-b-2 transition-all ${
              tab === "register" 
                ? "border-[#E8711A] text-[#E8711A] bg-white" 
                : "border-transparent text-zinc-500 hover:text-[#0D1B2A] hover:bg-zinc-100/50"
            }`}
          >
            Criar Conta
          </button>
          <button
            onClick={() => { setTab("login"); setError(null); setSuccess(null); }}
            className={`flex-1 py-3 text-center border-b-2 transition-all ${
              tab === "login" 
                ? "border-[#E8711A] text-[#E8711A] bg-white" 
                : "border-transparent text-zinc-500 hover:text-[#0D1B2A] hover:bg-zinc-100/50"
            }`}
          >
            Fazer Login
          </button>
        </div>

        {/* Body Form */}
        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-150 p-3 rounded-lg flex items-start gap-2.5 text-xs text-red-900 leading-relaxed font-sans">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 bg-emerald-50 border border-emerald-150 p-3 rounded-lg flex items-start gap-2.5 text-xs text-emerald-900 leading-relaxed font-sans">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={tab === "register" ? handleRegister : handleLogin} className="space-y-4">
            {tab === "register" && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-sans text-zinc-500 font-bold block uppercase tracking-wider">Seu Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-[#8A96A3]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Carolina Mendes"
                    className="w-full bg-white border border-zinc-250 py-2.5 pl-9 pr-4 rounded-xl text-xs font-sans text-[#0D1B2A] focus:outline-none focus:border-[#E8711A] focus:ring-1 focus:ring-[#E8711A]/20 transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-sans text-zinc-500 font-bold block uppercase tracking-wider">Endereço de E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-[#8A96A3]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ex: seuemail@provedor.com"
                  className="w-full bg-white border border-zinc-250 py-2.5 pl-9 pr-4 rounded-xl text-xs font-sans text-[#0D1B2A] focus:outline-none focus:border-[#E8711A] focus:ring-1 focus:ring-[#E8711A]/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-sans text-zinc-500 font-bold block uppercase tracking-wider">Senha de Acesso</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-[#8A96A3]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha secreta (mín. 6 caracteres)"
                  className="w-full bg-white border border-zinc-250 py-2.5 pl-9 pr-10 rounded-xl text-xs font-sans text-[#0D1B2A] focus:outline-none focus:border-[#E8711A] focus:ring-1 focus:ring-[#E8711A]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-[#8A96A3] hover:text-[#0D1B2A] p-0.5 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* CTA Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-[#E8711A] text-white hover:bg-[#0D1B2A] rounded-xl font-accent text-xs font-bold uppercase tracking-wider transition-all duration-300 disabled:opacity-50 select-none shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer"
            >
              {loading ? "Processando..." : tab === "register" ? "Criar Minha Conta 🌊" : "Entrar na Conta 🌊"}
            </button>
          </form>

          {/* Footnotes */}
          <p className="text-[10px] font-sans text-zinc-400 text-center mt-5 leading-relaxed">
            Seus dados estão protegidos. Ao prosseguir, você concorda com nossos termos de privacidade e garante o acesso aos recursos do ecossistema Guida Trips.
          </p>
        </div>
      </div>
    </div>
  );
}
