// EJEMPLOS
const ejemplosCasos = {
  conf: {
    nombreCaso: "Registrarse a la conferencia",
    idUnico: "Conf RG 003",
    fecha: "2026-08-08",
    area: "Gestión de Eventos / Registros",
    actores: "Participante, Sistema de Registro",
    interesados: "Organizadores de la conferencia, Depto. de Finanzas",
    nivel: "Azul (Meta de Usuario)",
    canal: "Web",
    interfaz: "Formulario Web",
    descripcion: "El participante completa el formulario web para registrarse a la conferencia, selecciona las sesiones a las que asistirá y confirma sus datos.",
    desencadenador: "El participante accede a la página de registro del evento y presiona 'Registrarse'.",
    tipoDesencadenador: "Externo",
    pasos: [
      { paso: "1. El participante ingresa sus datos personales y correo electrónico.", info: "Nombre completo, Email, Teléfono, Organización" },
      { paso: "2. El sistema valida los campos obligatorios y la disponibilidad de cupos.", info: "Estado del formulario, cupos disponibles en BD" },
      { paso: "3. El participante selecciona los talleres opcionales a los que desea asistir.", info: "Lista de talleres y horarios elegidos" },
      { paso: "4. El sistema guarda la reserva temporal y muestra el resumen del registro.", info: "ID de pre-registro, costo total ($0 o tarifa)" }
    ],
    flujosAlt: "3a. Si no hay cupos para un taller seleccionado, el sistema muestra un mensaje de advertencia y permite elegir otro taller o continuar sin él.",
    casosIncluidos: "AUTH 001 - Iniciar sesión",
    precondiciones: "La conferencia debe estar activa en la plataforma y el periodo de inscripción abierto.",
    postcondiciones: "El participante queda registrado correctamente en la base de datos de asistencia.",
    suposiciones: "El participante cuenta con una conexión a internet estable y un correo válido.",
    garantiaExito: "Se envía un correo automático de confirmación con el código QR de acceso.",
    garantiaMinima: "Se guarda el intento de registro y se notifica al usuario en caso de falla de red.",
    reqCumplidos: "RF-001 (Registro Web de Asistentes), RF-012 (Notificación por Correo Electrónico)",
    cuestionesPendientes: "¿Se integrará la pasarela de pago en esta misma pantalla para eventos de pago?",
    frecuencia: "Múltiples veces al día",
    prioridad: "Alta",
    riesgo: "Medio",
    notas: "El formulario debe ser completamente responsivo para dispositivos móviles."
  },
  auth: {
    nombreCaso: "Iniciar sesión de usuario",
    idUnico: "AUTH 001",
    fecha: "2026-08-08",
    area: "Seguridad / Autenticación",
    actores: "Usuario Registrado, Sistema de Autenticación",
    interesados: "Equipo de Seguridad de TI, Administradores del Sistema",
    nivel: "Azul (Meta de Usuario)",
    canal: "Web",
    interfaz: "Formulario Web",
    descripcion: "Permite a un usuario autenticarse en el sistema utilizando sus credenciales para acceder a sus funciones personalizadas.",
    desencadenador: "El usuario hace clic en el botón 'Iniciar Sesión' en la barra superior del portal.",
    tipoDesencadenador: "Externo",
    pasos: [
      { paso: "1. El usuario ingresa su usuario/correo y contraseña.", info: "Usuario, Contraseña encriptada" },
      { paso: "2. El sistema verifica las credenciales en la base de datos de seguridad.", info: "Hash de contraseña, estado de cuenta" },
      { paso: "3. El sistema genera un token de sesión (JWT) y redirige al panel principal.", info: "Token JWT, Rol de usuario" }
    ],
    flujosAlt: "2a. Si las credenciales son incorrectas, el sistema muestra el mensaje 'Usuario o contraseña inválidos' y solicita el intento nuevamente.",
    casosIncluidos: "Ninguno",
    precondiciones: "El usuario debe tener una cuenta previamente creada y activa.",
    postcondiciones: "Se inicia una sesión válida y se otorga acceso a las rutas protegidas.",
    suposiciones: "El usuario recuerda sus credenciales de acceso.",
    garantiaExito: "El usuario accede exitosamente a su área privada de navegación.",
    garantiaMinima: "El sistema bloquea la cuenta tras 5 intentos fallidos consecutivos.",
    reqCumplidos: "RF-005 (Autenticación Segura de Usuarios)",
    cuestionesPendientes: "¿Implementar autenticación de dos factores (2FA) en el siguiente sprint?",
    frecuencia: "Múltiples veces al día",
    prioridad: "Alta",
    riesgo: "Alto",
    notas: "Cumplir estrictamente con los estándares OWASP para el manejo de credenciales."
  }
};

let casoSeleccionadoTemp = "conf";

// NAVEGACIÓN ENTRE VISTAS
function seleccionarCasoInicial(val) {
  casoSeleccionadoTemp = val || "conf";
}

function comenzarPlantilla() {
  const select = document.getElementById("selectCasoInicial");
  const val = select.value; // Obtiene el valor exacto seleccionado

  document.getElementById("vistaInicio").classList.add("hidden");
  document.getElementById("mainContent").classList.remove("hidden");

  // Si hay un valor seleccionado y existe en el objeto de ejemplos, carga sus datos
  if (val && ejemplosCasos[val]) {
    cargarDatosEnFormulario(ejemplosCasos[val]);
  } else {
    // Si la opción es "Crear Nuevo en Blanco" (valor vacío ""), limpia todos los campos
    limpiarFormulario();
  }
}

function volverAInicio() {
  document.getElementById("mainContent").classList.add("hidden");
  document.getElementById("vistaInicio").classList.remove("hidden");
}

// MANEJO DE FILAS DE LA TABLA DE PASOS
function agregarFilaPaso(pasoText = "", infoText = "") {
  const tbody = document.getElementById("tablaPasos");
  const tr = document.createElement("tr");
  tr.className = "border-b border-pink-200";

  tr.innerHTML = `
    <td class="border-r-2 border-pink-300 p-1.5">
      <textarea required class="w-full p-1.5 outline-none paso-input input-custom" rows="2" placeholder="Describa el paso...">${pasoText}</textarea>
    </td>
    <td class="p-1.5">
      <div class="flex items-center gap-2">
        <textarea required class="w-full p-1.5 outline-none info-input input-custom" rows="2" placeholder="Información requerida...">${infoText}</textarea>
        <button type="button" onclick="eliminarFilaPaso(this)" class="no-print text-red-500 hover:text-red-700 p-1 font-bold text-base cursor-pointer" title="Eliminar Paso">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </td>
  `;

  tbody.appendChild(tr);
}

function eliminarFilaPaso(btn) {
  const tbody = document.getElementById("tablaPasos");
  if (tbody.children.length > 1) {
    btn.closest("tr").remove();
  } else {
    alert("El caso de uso debe contener al menos un paso.");
  }
}

// CARGA Y LIMPIEZA DE DATOS
function cargarDatosEnFormulario(data) {
  document.getElementById("nombreCaso").value = data.nombreCaso || "";
  document.getElementById("idUnico").value = data.idUnico || "";
  document.getElementById("fecha").value = data.fecha || "";
  document.getElementById("area").value = data.area || "";
  document.getElementById("actores").value = data.actores || "";
  document.getElementById("interesados").value = data.interesados || "";
  document.getElementById("nivel").value = data.nivel || "";
  document.getElementById("canal").value = data.canal || "";
  document.getElementById("interfaz").value = data.interfaz || "";
  document.getElementById("descripcion").value = data.descripcion || "";
  document.getElementById("desencadenador").value = data.desencadenador || "";
  document.getElementById("tipoDesencadenador").value = data.tipoDesencadenador || "";
  document.getElementById("flujosAlt").value = data.flujosAlt || "";
  document.getElementById("casosIncluidos").value = data.casosIncluidos || "";
  document.getElementById("precondiciones").value = data.precondiciones || "";
  document.getElementById("postcondiciones").value = data.postcondiciones || "";
  document.getElementById("suposiciones").value = data.suposiciones || "";
  document.getElementById("garantiaExito").value = data.garantiaExito || "";
  document.getElementById("garantiaMinima").value = data.garantiaMinima || "";
  document.getElementById("reqCumplidos").value = data.reqCumplidos || "";
  document.getElementById("cuestionesPendientes").value = data.cuestionesPendientes || "";
  document.getElementById("frecuencia").value = data.frecuencia || "";
  document.getElementById("prioridad").value = data.prioridad || "";
  document.getElementById("riesgo").value = data.riesgo || "";
  document.getElementById("notas").value = data.notas || "";

  const tbody = document.getElementById("tablaPasos");
  tbody.innerHTML = "";

  if (data.pasos && data.pasos.length > 0) {
    data.pasos.forEach(p => agregarFilaPaso(p.paso, p.info));
  } else {
    agregarFilaPaso();
  }
}

function limpiarFormulario() {
  document.getElementById("useCaseForm").reset();
  const tbody = document.getElementById("tablaPasos");
  tbody.innerHTML = "";
  agregarFilaPaso();
}

// MODAL VISTA DE EJEMPLOS (para que el usuario se guie)
function abrirModalEjemplos() {
  document.getElementById("comboEjemplosModal").value = "conf";
  verEjemploModoPDF("conf");
}

function verEjemploModoPDF(key) {
  if (!key || !ejemplosCasos[key]) return;
  casoSeleccionadoTemp = key;
  const data = ejemplosCasos[key];

  let pasosHTML = data.pasos.map(p => `
    <tr class="border-b border-pink-200">
      <td class="p-2 border-r border-pink-300">${p.paso}</td>
      <td class="p-2">${p.info}</td>
    </tr>
  `).join("");

  let htmlDoc = `
    <div class="border-2 border-pink-500 rounded-xl p-6 bg-pink-50 space-y-4 font-sans">
      <div class="bg-pink-600 text-white p-3 rounded-lg text-center font-bold text-lg">
        ${data.nombreCaso} (${data.idUnico})
      </div>
      <div class="grid grid-cols-2 gap-3 text-xs">
        <div><strong>Fecha:</strong> ${data.fecha}</div>
        <div><strong>Área:</strong> ${data.area}</div>
        <div><strong>Actor(es):</strong> ${data.actores}</div>
        <div><strong>Interesados:</strong> ${data.interesados}</div>
        <div><strong>Nivel:</strong> ${data.nivel}</div>
        <div><strong>Canal / Interfaz:</strong> ${data.canal} / ${data.interfaz}</div>
      </div>
      <div class="text-xs">
        <strong>Descripción:</strong>
        <p class="mt-1 bg-white p-2 rounded border border-pink-200">${data.descripcion}</p>
      </div>
      <div class="text-xs">
        <strong>Pasos Realizados (Ruta Principal):</strong>
        <table class="w-full mt-1 border border-pink-400 bg-white text-xs">
          <thead>
            <tr class="bg-pink-200 text-pink-900">
              <th class="p-2 text-left w-1/2 border-r border-pink-400">Flujo Principal</th>
              <th class="p-2 text-left w-1/2">Información Requerida</th>
            </tr>
          </thead>
          <tbody>${pasosHTML}</tbody>
        </table>
      </div>
      <div class="grid grid-cols-2 gap-3 text-xs">
        <div><strong>Precondiciones:</strong> ${data.precondiciones}</div>
        <div><strong>Postcondiciones:</strong> ${data.postcondiciones}</div>
        <div><strong>Garantía de Éxito:</strong> ${data.garantiaExito}</div>
        <div><strong>Prioridad / Riesgo:</strong> ${data.prioridad} / ${data.riesgo}</div>
      </div>
    </div>
  `;

  document.getElementById("contenidoHojaPDF").innerHTML = htmlDoc;
  document.getElementById("vistaEjemploPDF").classList.remove("hidden");
}

function cerrarVistaPDF() {
  document.getElementById("vistaEjemploPDF").classList.add("hidden");
}

function cargarEjemploEnFormulario() {
  if (casoSeleccionadoTemp && ejemplosCasos[casoSeleccionadoTemp]) {
    document.getElementById("vistaInicio").classList.add("hidden");
    document.getElementById("mainContent").classList.remove("hidden");
    cargarDatosEnFormulario(ejemplosCasos[casoSeleccionadoTemp]);
    cerrarVistaPDF();
  }
}

// GENERACIÓN PDF LIMPIA (para el PDF)
function guardarPlantillaPDF() {
  const form = document.getElementById("useCaseForm");
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // 1. Clonar el contenedor principal en memoria
  const elementoOriginal = document.getElementById("mainContent");
  const clon = elementoOriginal.cloneNode(true);

  // 2. Eliminar elementos de interfaz no deseados (para el pdf)
  const elementosAEliminar = clon.querySelectorAll('header, button, .no-print, title, script');
  elementosAEliminar.forEach(el => el.remove());

  // 3. Reemplazar inputs, textareas y selects por divs formateados con el texto ingresado
  const inputsOriginales = elementoOriginal.querySelectorAll("input, textarea, select");
  const inputsClonados = clon.querySelectorAll("input, textarea, select");

  inputsClonados.forEach((inputClon, index) => {
    const inputOrig = inputsOriginales[index];
    let valorTexto = "";

    if (inputOrig.tagName === "SELECT") {
      valorTexto = inputOrig.options[inputOrig.selectedIndex]?.text || "";
    } else {
      valorTexto = inputOrig.value;
    }

    const divTexto = document.createElement("div");
    divTexto.className = "pdf-replace-div";
    divTexto.innerText = valorTexto || " ";

    inputClon.parentNode.insertBefore(divTexto, inputClon);
    inputClon.remove();
  });

  // 4. Asegurar que todos los desplegables se mantengan abiertos 
  clon.querySelectorAll("details").forEach(d => d.setAttribute("open", "true"));

  // 5. Configurar pdf
  const opciones = {
    margin: [10, 10, 10, 10],
    filename: 'plantilla_casos_de_uso.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2, 
      useCORS: true,
      scrollY: 0
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'letter', 
      orientation: 'portrait' 
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  // 6. Generar el PDF 
  html2pdf().set(opciones).from(clon).save();
}