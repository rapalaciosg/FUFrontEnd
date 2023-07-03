<template>
  <modal-base>
    <template v-slot:modal-body>
      <div class="grid grid-cols-2 gap-5">
        <VueSelect :options="options" placeholder="Ruta" />
        <VueSelect :options="options" placeholder="Provincia" />
        <Textinput name="pn" type="text" placeholder="Identificador" :isReadonly="true" />
        <VueSelect :options="options" placeholder="Distrito" />
        <VueSelect :options="options" placeholder="MS, ABT, KIOSKO, ETV" />
        <VueSelect :options="options" placeholder="Corregimiento" />
        <Textinput name="pn" type="text" placeholder="Nombre del local" />
        <VueSelect :options="options" placeholder="Lugar poblado" />
        <Textinput name="pn" type="text" placeholder="RUC + DV o Cédula" />
        <Textinput name="pn" type="text" placeholder="Latitud" />
        <Textinput name="pn" type="text" placeholder="Digito verificador" />
        <Textinput name="pn" type="text" placeholder="Longitud" />
        <FromGroup name="d1">
          <flat-pickr
            v-model="dateDefault"
            class="form-control"
            id="d1"
            placeholder="Fecha de nacimiento"
          />
        </FromGroup>
        <Textinput name="pn" type="number" placeholder="Nuestros tanques" />
        <Textinput name="pn" type="text" placeholder="Dirección" />
        <Textinput name="pn" type="text" placeholder="Precio" :isReadonly="true" />
        <VueSelect :options="options" placeholder="Tipo cliente" />
        <Textinput name="pn" type="number" placeholder="Otros tanques" />
        <Textinput name="pn" type="number" placeholder="Número de casa" />
        <Textinput name="pn" type="text" placeholder="Contacto" />
        <Textinput name="pn" type="number" placeholder="Teléfono o celula" />
        <Textinput name="pn" type="text" placeholder="Observaciones" />
      </div>
    </template>
  </modal-base>
</template>

<script>
import ModalBase from "../ModalBase.vue";
import Textinput from "@/components/DashCodeComponents/Textinput";
import FromGroup from "@/components/DashCodeComponents/FromGroup";
import VueSelect from "@/components/DashCodeComponents/Select/VueSelect";

export default {
  components: {
    ModalBase,
    Textinput,
    FromGroup,
    VueSelect,
  },
  data() {
    return {
      dateDefault: "",
      options: [
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" },
        { value: "option3", label: "Option 3" },
      ],
    }
  }
};
</script>