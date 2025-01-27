"use client";


import Modal from "@/components/molecules/Modal";
import { FormInputsRow, Evaluation, ProfessionalDetails } from "@/app/lib/types";
import { fetchEvaluationById } from "@/app/actions/fetchEvaluationById";
import { fetchProfessionalDetails } from "@/app/actions/fetchProfessionalDetails";
import { handleUpdateEvaluation } from "@/app/actions/handleUpdateEvaluation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { evaluationSchema } from "@/app/lib/validationSchemas";

function Page({
  params,
}: {
  params: { proId: string; evaluationId: string };
}) {
  const { proId, evaluationId } = params;

  console.log("Pro ID:", proId);
  console.log("Evaluación ID:", evaluationId);

  const routeToRedirect = `/pros/${proId}`;

  const [evaluationData, setEvaluationData] = useState<Evaluation | null>(null);
  const [professionalDetails, setProfessionalDetails] = useState<ProfessionalDetails | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const evalData = await fetchEvaluationById(parseInt(evaluationId));
        setEvaluationData(evalData);

        const proDetails = await fetchProfessionalDetails(proId);
        setProfessionalDetails(proDetails);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchData();
  }, [evaluationId, proId]);

  const candidateName = professionalDetails?.candidateName || "Nombre no disponible";

  const fields: FormInputsRow = [
    {
      label: "Fecha",
      placeholder: "Fecha de evaluación",
      type: "date",
      name: "date",
      defaultValue: evaluationData?.date ? new Date(evaluationData.date).toISOString().split("T")[0] : "",
    },
    [
      {
        label: "Dominio del stack tecnológico",
        placeholder: "Número de 0-7",
        type: "number",
        name: "stack",
        step: "0.1", // Permitir decimales
        min: "0",
        max: "7",
        defaultValue: evaluationData?.eval_stack,
      },
      {
        label: "Habilidades de comunicación",
        placeholder: "Número de 0-7",
        type: "number",
        name: "comunicacion",
        step: "0.1", // Permitir decimales
        min: "0",
        max: "7",
        defaultValue: evaluationData?.eval_comunicacion,
      },
    ],
    [
      {
        label: "Responsabilidad y cumplimiento",
        placeholder: "Número de 0-7",
        type: "number",
        name: "cumplimiento",
        step: "0.1", // Permitir decimales
        min: "0",
        max: "7",
        defaultValue: evaluationData?.eval_cumplimiento,
      },
      {
        label: "Proactividad y motivación",
        placeholder: "Número de 0-7",
        type: "number",
        name: "motivacion",
        step: "0.1", // Permitir decimales
        min: "0",
        max: "7",
        defaultValue: evaluationData?.eval_motivacion,
      },
    ],
    {
      label: "Comentario de la jefatura",
      placeholder: "Comentario de la jefatura",
      type: "textarea",
      name: "comment",
      defaultValue: evaluationData?.client_comment,
    },
    {
      label: "Acciones ACL",
      placeholder: "Acciones ACL",
      type: "textarea",
      name: "acciones",
      defaultValue: evaluationData?.acciones_acl,
    },
    {
      label: "Proyección del servicio",
      placeholder: "Proyección del servicio",
      type: "textarea",
      name: "proyecction",
      defaultValue: evaluationData?.proyecction,
    },
    [
      { type: "cancel", value: "Cancelar", href: routeToRedirect },
      { type: "submit", value: "Guardar Nota" },
    ],
  ];

  const handleUpdate = async (
    formData: FormData,
    actualRoute: string
  ): Promise<{
    message: string;
    route: string;
    statusCode: number;
  }> => {
    try {
      const formattedData: {
        date: string | null;
        eval_stack: number | null;
        eval_comunicacion: number | null;
        eval_motivacion: number | null;
        eval_cumplimiento: number | null;
        client_comment: FormDataEntryValue | null;
        acciones_acl: FormDataEntryValue | null;
        proyecction: FormDataEntryValue | null;
      } = {
        date: formData.get("date") ? new Date(formData.get("date") as string).toISOString() : null,
        eval_stack: formData.get("stack") ? parseFloat(formData.get("stack") as string) : null, // Cambiar parseInt por parseFloat
        eval_comunicacion: formData.get("comunicacion") ? parseFloat(formData.get("comunicacion") as string) : null,
        eval_motivacion: formData.get("motivacion") ? parseFloat(formData.get("motivacion") as string) : null,
        eval_cumplimiento: formData.get("cumplimiento") ? parseFloat(formData.get("cumplimiento") as string) : null,
        client_comment: formData.get("comment") ?? null,
        acciones_acl: formData.get("acciones") ?? null,
        proyecction: formData.get("proyecction") ?? null,
      };

      console.log("Datos a enviar:", formattedData);

      const response = await handleUpdateEvaluation(evaluationId, formattedData);

      console.log("Respuesta de onSubmit:", response);

      if (response && response.route) {
        router.push(response.route);
      } else {
        console.error("La respuesta no contiene 'route':", response);
      }

      return {
        message: "Evaluación actualizada con éxito",
        route: routeToRedirect,
        statusCode: 200,
      };
    } catch (error) {
      console.error("Error al actualizar:", error);
      return {
        message: "Error al actualizar la evaluación",
        route: actualRoute,
        statusCode: 500,
      };
    }
  };

  return (
    <Modal
      rows={fields}
      onSubmit={handleUpdate}
      title={`Evaluación de ${candidateName}`}
      validationSchema={evaluationSchema}
    />


  );
}

export default Page;
