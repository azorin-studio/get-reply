import { supabaseAdminClient } from "~/supabase/server-client";
import { cancelLogAndActionByLogId } from "~/supabase/supabase";

export default async function cancel (log_id: string) {
  await cancelLogAndActionByLogId(supabaseAdminClient, log_id)
}