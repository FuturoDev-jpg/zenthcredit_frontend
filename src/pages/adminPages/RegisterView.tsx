import { useState, useEffect } from "react";

import axios from "axios";

import { Link, useParams, useNavigate } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import InputMask from "react-input-mask";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

import { ChevronLeft, Trash, Pencil, UserRoundCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const formSchema = z.object({
  nome: z
    .string()
    .nonempty({ message: "Este campo é obrigatório" })
    .min(3, { message: "Este campo deve conter pelo menos 3 caracteres." })
    .max(50, {
      message:
        "Você excedeu o limite de caracteres, abrevie o nome caso seja grande.",
    })
    .regex(/^[a-zA-Z\s.áéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇàèìòùÀÈÌÒÙ]*$/, {
      message: "Não é permitido caracteres especiais e números.",
    }),
  email: z
    .string()
    .nonempty({ message: "Este campo é obrigatório" })
    .email({ message: "Insira um email válido!" })
    .min(4)
    .max(100),
  telefone: z
    .string()
    .nonempty({ message: "Este campo é obrigatório" })
    .min(15, { message: "Insira um número válido!" }),
  cpf: z.string().min(14, { message: "Ínsira um CPF válido!" }),
  nascimento: z
    .string()
    .nonempty({ message: "Este campo é obrigatório" })
    .min(10, { message: "Ínsira uma data válida!" })
    .regex(
      /^(0[1-9]|[12][0-9]|3[01])\/(02)\/(19\d{2}|200[0-7])$|^(0[1-9]|[12][0-9]|30)\/(04|06|09|11)\/(19\d{2}|200[0-7])$|^(0[1-9]|[12][0-9]|3[01])\/(01|03|05|07|08|10|12)\/(19\d{2}|200[0-7])$/,
      { message: "Data ínvalida ou menor de 18 anos" },
    ),
  cep: z
    .string()
    .nonempty({ message: "Este campo é obrigatório" })
    .min(9, { message: "Ínsira um CEP válido!" }),
  renda: z.string().nonempty({ message: "Este campo é obrigatório" }),
  ocupacao: z.string().nonempty({ message: "Este campo é obrigatório" }),
  motivo: z.string().nonempty({ message: "Este campo é obrigatório" }),
  garantia: z.string().nonempty({ message: "Este campo é obrigatório" }),
});

import { useAuth } from "@/context/authContext";

export default function RegisterView() {
  const { token } = useAuth();

  const navigate = useNavigate();

  function containsPdf(text: string) {
    const regex = /pdf$|pdf/i;

    return regex.test(text);
  }

  const deleteUser = async (id: string) => {
    setDeleteLoad(true);
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_API_URL}/cadastros/delete/${id}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success(data.success);
      setDeleteLoad(false);
      navigate("../admin/cadastros/", { replace: true });
    } catch (error) {
      setDeleteLoad(false);
      console.log(error);
    }
  };

  const location = useParams();
  const [deleteLoad, setDeleteLoad] = useState(false);
  const [editMode, setEditMode] = useState(true);
  const [user, setUser] = useState({
    _id: "",
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    nascimento: "",
    renda: "",
    ocupacao: "",
    motivo: "",
    garantia: "",
    cep: "",
    documentos: [
      {
        comprovante_renda: [
          {
            url: "",
            key: "",
          },
        ],
        residencia: [
          {
            url: "",
            key: "",
          },
        ],
        identidade: [
          {
            url: "",
            key: "",
          },
        ],
      },
    ],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      cpf: "",
      nascimento: "",
      cep: "",
      renda: "",
      ocupacao: "",
      motivo: "",
      garantia: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  console.log(user.documentos[0].residencia[0]);

  useEffect(() => {
    async function fetchData() {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/cadastros/find_user_unique?id=${location.id}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(data);
      setUser(data);
    }
    fetchData();
  }, []);

  return (
    <>
      {!editMode && (
        <section className="m-4 mt-20">
          <div className="flex gap-4 items-center mb-4">
            <Link to="/admin/cadastros">
              <ChevronLeft />
            </Link>
            <h1 className="text-2xl font-semibold">Consulta de cadastro</h1>
          </div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg text-blue-500">
                ID: {user._id}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  onClick={() => setEditMode(true)}
                  className="bg-yellow-500 hover:bg-yellow-600"
                >
                  <Pencil />
                </Button>
                <Dialog>
                  <DialogTrigger>
                    <Button className="bg-red-400 hover:bg-red-500">
                      <Trash />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Tem certeza que deseja{" "}
                        <strong className="text-red-500">Deletar?</strong>
                      </DialogTitle>
                      <DialogDescription>
                        Você tem certeza que gostaria de deletar{" "}
                        <strong>{user.nome}</strong> dos cadastros?
                      </DialogDescription>
                    </DialogHeader>
                    <Button
                      className="bg-red-400 hover:bg-red-500"
                      onClick={() => deleteUser(user._id)}
                      disabled={deleteLoad}
                    >
                      {deleteLoad ? "Aguarde..." : "Deletar"}
                    </Button>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold text-slate-400">
                  Informações Gerais
                </h3>
                <span>
                  <strong className="font-semibold text-slate-600">
                    Nome :
                  </strong>{" "}
                  {user.nome}
                </span>
                <span>
                  <strong className="font-semibold text-slate-600">
                    Email :
                  </strong>{" "}
                  {user.email}
                </span>
                <span>
                  <strong className="font-semibold text-slate-600">
                    Telefone :
                  </strong>{" "}
                  {user.telefone}
                </span>
                <span>
                  <strong className="font-semibold text-slate-600">
                    CPF :
                  </strong>{" "}
                  {user.cpf}
                </span>
                <span>
                  <strong className="font-semibold text-slate-600">
                    Nascimento :
                  </strong>{" "}
                  {user.nascimento}
                </span>
                <span>
                  <strong className="font-semibold text-slate-600">
                    CEP :
                  </strong>{" "}
                  {user.cep}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold text-slate-400">
                  Análise de Perfil
                </h3>
                <span>
                  <strong className="font-semibold text-slate-600">
                    Renda Mensal :
                  </strong>{" "}
                  {user.renda}
                </span>
                <span>
                  <strong className="font-semibold text-slate-600">
                    Ocupação :
                  </strong>{" "}
                  {user.ocupacao}
                </span>
                <span>
                  <strong className="font-semibold text-slate-600">
                    Motivo do empréstimo :
                  </strong>{" "}
                  {user.motivo}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold text-slate-400">
                  Análise de Garantia
                </h3>
                <span>
                  <strong className="font-semibold text-slate-600">
                    Possui garantia :
                  </strong>{" "}
                  {user.garantia}
                </span>
              </div>
            </CardContent>
          </Card>
          <br />
          <Card>
            <CardHeader className="flex flex-col">
              <div className="flex flex-row justify-between items-center">
                <CardTitle>Verificação de Identidade</CardTitle>
                <UserRoundCheck />
              </div>
              <CardDescription>
                Para ampliar as imagens/documentos, basta clica-las!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col justify-center m-4 items-center">
                <div className="flex flex-col gap-12 w-full">
                  <div className="flex flex-col items-center text-blue-400 font-semibold text-lg lg:text-3xl">
                    <span className="mb-2">Identidade</span>
                    {containsPdf(user?.documentos[0].identidade[0].url) ? (
                      <div
                        className="flex flex-col items-center justify-center cursor-pointer w-[200px] h-[200px] bg-red-400 hover:bg-red-500 transition-colors rounded-lg"
                        onClick={() => {
                          window.open(
                            `${user?.documentos[0].identidade[0].url}`,
                          );
                        }}
                      >
                        <div className="flex flex-col items-center justify-center select-none">
                          <h2 className="text-3xl text-white">PDF</h2>
                          <span className="text-xs text-white">
                            Clique para visualizar
                          </span>
                        </div>
                      </div>
                    ) : (
                      <img
                        className="rounded-lg lg:w-72 cursor-pointer"
                        onClick={() => {
                          window.open(
                            `${user?.documentos[0].identidade[0].url}`,
                          );
                        }}
                        src={user?.documentos[0].identidade[0].url}
                        width={150}
                        height={200}
                        alt="Comprovante de Residencia"
                      />
                    )}
                  </div>
                  <div className="flex flex-col text-lg lg:text-3xl items-center text-blue-400 font-semibold">
                    <span className="mb-2">Comprovante de Renda</span>
                    {containsPdf(
                      user?.documentos[0].comprovante_renda[0].url,
                    ) ? (
                      <div
                        className="flex flex-col items-center justify-center cursor-pointer w-[200px] h-[200px] bg-red-400 hover:bg-red-500 transition-colors rounded-lg"
                        onClick={() => {
                          window.open(
                            `${user?.documentos[0].comprovante_renda[0].url}`,
                          );
                        }}
                      >
                        <div className="flex flex-col items-center justify-center select-none">
                          <h2 className="text-3xl text-white">PDF</h2>
                          <span className="text-xs text-white">
                            Clique para visualizar
                          </span>
                        </div>
                      </div>
                    ) : (
                      <img
                        className="rounded-lg lg:w-72 cursor-pointer"
                        onClick={() => {
                          window.open(
                            `${user?.documentos[0].comprovante_renda[0].url}`,
                          );
                        }}
                        src={user?.documentos[0].comprovante_renda[0].url}
                        width={150}
                        height={200}
                        alt="Comprovante de Residencia"
                      />
                    )}
                  </div>
                  <div className="flex flex-col text-lg lg:text-3xl items-center text-blue-400 font-semibold">
                    <span className="mb-2">Comprovante de Residência</span>
                    {containsPdf(user?.documentos[0].residencia[0].url) ? (
                      <div
                        className="flex flex-col items-center justify-center cursor-pointer w-[200px] h-[200px] bg-red-400 hover:bg-red-500 transition-colors rounded-lg"
                        onClick={() => {
                          window.open(
                            `${user?.documentos[0].residencia[0].url}`,
                          );
                        }}
                      >
                        <div className="flex flex-col items-center justify-center select-none">
                          <h2 className="text-3xl text-white">PDF</h2>
                          <span className="text-xs text-white">
                            Clique para visualizar
                          </span>
                        </div>
                      </div>
                    ) : (
                      <img
                        className="rounded-lg lg:w-72 cursor-pointer"
                        onClick={() => {
                          window.open(
                            `${user?.documentos[0].residencia[0].url}`,
                          );
                        }}
                        src={user?.documentos[0].residencia[0].url}
                        width={150}
                        height={200}
                        alt="Comprovante de Residencia"
                      />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Modo edição */}
      {editMode && (
        <>
          <div className="flex p-2 bg-black/50 rounded-lg gap-4 fixed bottom-20 right-5">
            <Button onClick={() => setEditMode(false)} variant="destructive">
              Cancelar
            </Button>
            <Button className="bg-green-500 hover:bg-green-600">Salvar</Button>
          </div>
          <section className="m-4 mt-20">
            <div className="flex gap-4 items-center mb-4">
              <Link to="/admin/cadastros">
                <ChevronLeft />
              </Link>
              <h1 className="text-2xl font-semibold">Consulta de cadastro</h1>
            </div>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg text-blue-500">
                  ID: {user._id}
                </CardTitle>
                <div className="flex gap-2">
                  <h2 className="text-yellow-500 font-semibold">
                    MODO EDIÇÃO ATIVADO
                  </h2>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-400">
                          Informações Gerais
                        </h3>
                        <br/>
                        <div className="flex flex-col gap-2">
                          <FormField
                            control={form.control}
                            name="nome"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={user.nome}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={user.email}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="telefone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Telefone / WhatsApp</FormLabel>
                                <FormControl>
                                  <InputMask mask="(99) 99999-9999" {...field}>
                                    {() => (
                                      <Input
                                        placeholder={user.telefone}
                                        {...field}
                                      />
                                    )}
                                  </InputMask>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="cpf"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CPF</FormLabel>
                                <FormControl>
                                  <InputMask mask="999.999.999-99" {...field}>
                                    {() => (
                                      <Input
                                        placeholder={user.cpf}
                                        {...field}
                                      />
                                    )}
                                  </InputMask>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="nascimento"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nascimento</FormLabel>
                                <FormControl>
                                  <InputMask mask="99/99/9999" {...field}>
                                    {() => (
                                      <Input placeholder={user.nascimento} {...field} />
                                    )}
                                  </InputMask>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="cep"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CEP</FormLabel>
                                <FormControl>
                                  <InputMask mask="99999-999" {...field}>
                                    {() => (
                                      <Input placeholder={user.cep} {...field} />
                                    )}
                                  </InputMask>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-400">
                          Análise de Perfil
                        </h3>
                        <br/>
                        <div className="flex flex-col gap-2">
                          <FormField
                            control={form.control}
                            name="nome"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={user.nome}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={user.email}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="telefone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Telefone / WhatsApp</FormLabel>
                                <FormControl>
                                  <InputMask mask="(99) 99999-9999" {...field}>
                                    {() => (
                                      <Input
                                        placeholder={user.telefone}
                                        {...field}
                                      />
                                    )}
                                  </InputMask>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="cpf"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CPF</FormLabel>
                                <FormControl>
                                  <InputMask mask="999.999.999-99" {...field}>
                                    {() => (
                                      <Input
                                        placeholder={user.cpf}
                                        {...field}
                                      />
                                    )}
                                  </InputMask>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="nascimento"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nascimento</FormLabel>
                                <FormControl>
                                  <InputMask mask="99/99/9999" {...field}>
                                    {() => (
                                      <Input placeholder={user.nascimento} {...field} />
                                    )}
                                  </InputMask>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="cep"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CEP</FormLabel>
                                <FormControl>
                                  <InputMask mask="99999-999" {...field}>
                                    {() => (
                                      <Input placeholder={user.cep} {...field} />
                                    )}
                                  </InputMask>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
            <br />
            <Card>
              <CardHeader className="flex flex-col">
                <div className="flex flex-row justify-between items-center">
                  <CardTitle>Verificação de Identidade</CardTitle>
                  <UserRoundCheck />
                </div>
                <CardDescription>
                  Para ampliar as imagens/documentos, basta clica-las!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col justify-center m-4 items-center">
                  <div className="flex flex-col gap-12 w-full">
                    <div className="flex flex-col items-center text-blue-400 font-semibold text-lg lg:text-3xl">
                      <span className="mb-2">Identidade</span>
                      {containsPdf(user?.documentos[0].identidade[0].url) ? (
                        <div
                          className="flex flex-col items-center justify-center cursor-pointer w-[200px] h-[200px] bg-red-400 hover:bg-red-500 transition-colors rounded-lg"
                          onClick={() => {
                            window.open(
                              `${user?.documentos[0].identidade[0].url}`,
                            );
                          }}
                        >
                          <div className="flex flex-col items-center justify-center select-none">
                            <h2 className="text-3xl text-white">PDF</h2>
                            <span className="text-xs text-white">
                              Clique para visualizar
                            </span>
                          </div>
                        </div>
                      ) : (
                        <img
                          className="rounded-lg lg:w-72 cursor-pointer"
                          onClick={() => {
                            window.open(
                              `${user?.documentos[0].identidade[0].url}`,
                            );
                          }}
                          src={user?.documentos[0].identidade[0].url}
                          width={150}
                          height={200}
                          alt="Comprovante de Residencia"
                        />
                      )}
                    </div>
                    <div className="flex flex-col text-lg lg:text-3xl items-center text-blue-400 font-semibold">
                      <span className="mb-2">Comprovante de Renda</span>
                      {containsPdf(
                        user?.documentos[0].comprovante_renda[0].url,
                      ) ? (
                        <div
                          className="flex flex-col items-center justify-center cursor-pointer w-[200px] h-[200px] bg-red-400 hover:bg-red-500 transition-colors rounded-lg"
                          onClick={() => {
                            window.open(
                              `${user?.documentos[0].comprovante_renda[0].url}`,
                            );
                          }}
                        >
                          <div className="flex flex-col items-center justify-center select-none">
                            <h2 className="text-3xl text-white">PDF</h2>
                            <span className="text-xs text-white">
                              Clique para visualizar
                            </span>
                          </div>
                        </div>
                      ) : (
                        <img
                          className="rounded-lg lg:w-72 cursor-pointer"
                          onClick={() => {
                            window.open(
                              `${user?.documentos[0].comprovante_renda[0].url}`,
                            );
                          }}
                          src={user?.documentos[0].comprovante_renda[0].url}
                          width={150}
                          height={200}
                          alt="Comprovante de Residencia"
                        />
                      )}
                    </div>
                    <div className="flex flex-col text-lg lg:text-3xl items-center text-blue-400 font-semibold">
                      <span className="mb-2">Comprovante de Residência</span>
                      {containsPdf(user?.documentos[0].residencia[0].url) ? (
                        <div
                          className="flex flex-col items-center justify-center cursor-pointer w-[200px] h-[200px] bg-red-400 hover:bg-red-500 transition-colors rounded-lg"
                          onClick={() => {
                            window.open(
                              `${user?.documentos[0].residencia[0].url}`,
                            );
                          }}
                        >
                          <div className="flex flex-col items-center justify-center select-none">
                            <h2 className="text-3xl text-white">PDF</h2>
                            <span className="text-xs text-white">
                              Clique para visualizar
                            </span>
                          </div>
                        </div>
                      ) : (
                        <img
                          className="rounded-lg lg:w-72 cursor-pointer"
                          onClick={() => {
                            window.open(
                              `${user?.documentos[0].residencia[0].url}`,
                            );
                          }}
                          src={user?.documentos[0].residencia[0].url}
                          width={150}
                          height={200}
                          alt="Comprovante de Residencia"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </>
      )}
    </>
  );
}
