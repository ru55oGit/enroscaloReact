import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Layout from "../components/Layout";

export default function PrivacyPolicy() {
  return (
    <Layout showFooter>
      <Box sx={{ width: "100%", px: 2, pb: 4, color: "#fff" }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 3, mt: 1 }}>
          Política de Privacidad
        </Typography>

        <Typography sx={{ mb: 2, lineHeight: 1.7 }}>
          En <strong>Enroscado</strong> (enroscado.com) respetamos tu privacidad. Esta política explica qué información se recopila y cómo se usa.
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>
          1. Información que recopilamos
        </Typography>
        <Typography sx={{ mb: 2, lineHeight: 1.7 }}>
          Enroscado no recopila datos personales de forma directa. Tu progreso en el juego se guarda localmente en tu dispositivo (localStorage) y no se envía a ningún servidor.
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>
          2. Publicidad — Google AdSense
        </Typography>
        <Typography sx={{ mb: 2, lineHeight: 1.7 }}>
          Usamos <strong>Google AdSense</strong> para mostrar anuncios. Google puede usar cookies para personalizar los anuncios según tus intereses y el contenido que visitás. Para más información, consultá la{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#ffd" }}
          >
            Política de Privacidad de Google
          </a>. Podés optar por no recibir publicidad personalizada en{" "}
          <a
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#ffd" }}
          >
            Configuración de anuncios de Google
          </a>.
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>
          3. Cookies
        </Typography>
        <Typography sx={{ mb: 2, lineHeight: 1.7 }}>
          Este sitio utiliza cookies propias (para guardar tu idioma y preferencias) y cookies de terceros de Google AdSense para la entrega de anuncios. Al continuar usando el sitio, aceptás el uso de cookies.
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>
          4. Servicios de terceros
        </Typography>
        <Typography sx={{ mb: 2, lineHeight: 1.7 }}>
          Únicamente utilizamos Google AdSense como servicio de terceros. No compartimos datos con otras empresas ni vendemos información a terceros.
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>
          5. Menores de edad
        </Typography>
        <Typography sx={{ mb: 2, lineHeight: 1.7 }}>
          Este sitio no está dirigido a menores de 13 años ni recopila intencionalmente información de ellos.
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>
          6. Cambios en esta política
        </Typography>
        <Typography sx={{ mb: 2, lineHeight: 1.7 }}>
          Podemos actualizar esta política en cualquier momento. Te recomendamos revisarla periódicamente. La fecha de última actualización es junio de 2025.
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>
          7. Contacto
        </Typography>
        <Typography sx={{ mb: 2, lineHeight: 1.7 }}>
          Si tenés preguntas sobre esta política, podés contactarnos en{" "}
          <a href="mailto:patricio.ezequiel.toledo@gmail.com" style={{ color: "#ffd" }}>
            patricio.ezequiel.toledo@gmail.com
          </a>.
        </Typography>
      </Box>
    </Layout>
  );
}
