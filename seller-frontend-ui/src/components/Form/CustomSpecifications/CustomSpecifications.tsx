import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DeleteIcon, PlusCircleIcon, Trash } from "lucide-react";
import { Controller, useFieldArray, type Control } from "react-hook-form";
import { file } from "zod";

export default function CustomSpecifications({
  control,
}: {
  control: Control;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "customSpecifications",
  });

  return (
    <section>
      <Label>Custom Specifications</Label>

      {fields.map((field, i) => (
        <div key={field.id}>
          <div>
            {/* specification name */}
            <Controller
              name={`customSpecification.${i}.name`}
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`customSpecification.${i}.name`}>
                    Specification Name
                  </FieldLabel>
                  <Input
                    {...field}
                    id={`customSpecification.${i}.name`}
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="e.g. Weight, Material, Battery"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* specification value */}
            <Controller
              name={`customSpecification.${i}.value`}
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`customSpecification.${i}.value`}>
                    Specification Value
                  </FieldLabel>
                  <Input
                    {...field}
                    id={`customSpecification.${i}.value`}
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="e.g. 1KG, Plastic, 4000mAh"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <Button
            type="button"
            variant={"destructive"}
            onClick={() => remove(i)}
            size={"icon-sm"}
            className=""
          >
            <Trash />
          </Button>
        </div>
      ))}
      <button type="button" onClick={() => append({ name: "", value: "" })}>
        <PlusCircleIcon />
        Add Specification
      </button>
    </section>
  );
}
