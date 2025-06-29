
import { FormLabel } from "@/components/ui/form"
import { GuidanceTooltip } from "./guidance-tooltip"
import { AiSuggestionButton } from "./ai-suggestion-button"
import type { UseFormReturn } from "react-hook-form"
import type { FormValues } from "@/lib/formSchema"
import type { StepField } from "@/lib/constants"

interface FormFieldWrapperProps {
    children: React.ReactNode
    form: UseFormReturn<FormValues, any, undefined>;
    fieldName: StepField
    label: string
    guidance?: string
    aiEnabled?: boolean
}

export function FormFieldWrapper({
    children,
    form,
    fieldName,
    label,
    guidance,
    aiEnabled,
}: FormFieldWrapperProps) {
    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                    <FormLabel>{label}</FormLabel>
                    {guidance && <GuidanceTooltip>{guidance}</GuidanceTooltip>}
                </div>
                {aiEnabled && <AiSuggestionButton form={form} fieldName={fieldName} fieldLabel={label} />}
            </div>
            {children}
        </div>
    )
}
