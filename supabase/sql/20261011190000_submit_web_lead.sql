-- Alta de leads desde el formulario de la web (arrambidetech.com).
-- Se aplica pegándola en el SQL Editor de ArrambideTech-Core (convención del Core).
--
-- Qué hace: expone UNA función que el navegador puede llamar con la clave pública (anon/publishable).
-- La tabla `leads` sigue cerrada: anon no puede leer ni escribir directo.
-- La función valida, frena ráfagas y reutiliza `upsert_lead` (misma deduplicación de 30 días).
-- Depende de: public.leads y public.upsert_lead (migración 20261011160000_leads.sql).

BEGIN;

CREATE OR REPLACE FUNCTION public.submit_web_lead(
  p_name      text,
  p_company   text,
  p_contact   text,
  p_need      text,
  p_message   text,
  p_honeypot  text DEFAULT ''
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_name    text := trim(coalesce(p_name, ''));
  v_company text := trim(coalesce(p_company, ''));
  v_contact text := trim(coalesce(p_contact, ''));
  v_need    text := trim(coalesce(p_need, ''));
  v_message text := trim(coalesce(p_message, ''));
  v_email   text;
  v_phone   text;
  v_ext     text;
  v_digits  text;
  v_res     jsonb;
BEGIN
  -- Campo trampa: un humano no lo ve ni lo completa. Se responde "ok" para no dar pistas.
  IF trim(coalesce(p_honeypot, '')) <> '' THEN
    RETURN jsonb_build_object('ok', true);
  END IF;

  IF v_name = '' OR v_contact = '' OR v_message = '' THEN
    RETURN jsonb_build_object('ok', false, 'error', 'faltan_datos');
  END IF;

  IF length(v_name) > 120 OR length(v_company) > 160 OR length(v_contact) > 160
     OR length(v_need) > 160 OR length(v_message) > 2000 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'datos_invalidos');
  END IF;

  -- Límite de ráfagas: protege la tabla de un script que llame a la función en bucle.
  IF (SELECT count(*) FROM public.leads
       WHERE source = 'web' AND created_at > now() - interval '1 minute') >= 10
     OR (SELECT count(*) FROM public.leads
          WHERE source = 'web' AND created_at > now() - interval '1 hour') >= 100 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'demasiados_envios');
  END IF;

  -- Se extrae email o teléfono si se puede; si no, el contacto se guarda tal cual.
  v_ext := lower(regexp_replace(v_contact, '\s', '', 'g'));
  IF position('@' IN v_contact) > 0 THEN
    v_email := lower(v_contact);
  ELSE
    v_digits := regexp_replace(v_contact, '[^0-9]', '', 'g');
    IF length(v_digits) >= 6 THEN
      v_phone := regexp_replace(v_contact, '[^0-9+]', '', 'g');
      v_ext   := v_digits;
    END IF;
  END IF;

  v_res := public.upsert_lead(
    'web',                 -- p_source
    v_ext,                 -- p_external_id (estable: deduplica por persona)
    NULL,                  -- p_external_username
    v_name,                -- p_external_name
    v_name,                -- p_name
    v_contact,             -- p_contact (tal cual lo escribió)
    v_phone,               -- p_phone
    v_email,               -- p_email
    NULLIF(v_need, ''),    -- p_need
    NULL,                  -- p_suggested_system
    v_message,             -- p_message
    NULL,                  -- p_company_id (usa el de Arrambide Tech)
    jsonb_build_object('company', NULLIF(v_company, ''), 'channel', 'web_form')
  );

  RETURN jsonb_build_object('ok', true, 'id', v_res->'id', 'is_new', v_res->'is_new');
END $$;

REVOKE ALL ON FUNCTION public.submit_web_lead(text, text, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_web_lead(text, text, text, text, text, text) TO anon, authenticated;

COMMIT;

-- ─────────────────────────────────────────────────────────────────────────────
-- Verificación (correr después de aplicar; borra el lead de prueba al final):
--
--   SELECT public.submit_web_lead('Prueba Web', 'Empresa de prueba', 'prueba@example.com',
--                                 'Sistema a medida', 'Mensaje de prueba', '');
--   -- esperado: {"ok": true, "id": "...", "is_new": true}
--
--   SELECT id, source, name, contact, email, need, raw FROM public.leads
--    WHERE source = 'web' ORDER BY created_at DESC LIMIT 3;
--
--   DELETE FROM public.leads WHERE source = 'web' AND email = 'prueba@example.com';
--
-- Rollback:
--   DROP FUNCTION IF EXISTS public.submit_web_lead(text, text, text, text, text, text);
-- ─────────────────────────────────────────────────────────────────────────────
