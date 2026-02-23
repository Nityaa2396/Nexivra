import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface Generation {
  id: string;
  user_id: string;
  recipe_id: string;
  inputs: Record<string, string>;
  output: string;
  gate_results: Record<string, unknown>[];
  created_at: string;
}

export interface UserProfile {
  id: string;
  clerk_id: string;
  email: string;
  name: string | null;
  created_at: string;
  generations_count: number;
}

// Database functions
export async function saveGeneration(
  userId: string,
  recipeId: string,
  inputs: Record<string, string>,
  output: string,
  gateResults: Record<string, unknown>[]
) {
  const { data, error } = await supabase
    .from('generations')
    .insert({
      user_id: userId,
      recipe_id: recipeId,
      inputs,
      output,
      gate_results: gateResults,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserGenerations(userId: string, limit = 20) {
  const { data, error } = await supabase
    .from('generations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function getOrCreateUser(clerkId: string, email: string, name: string | null) {
  // Try to get existing user
  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_id', clerkId)
    .single();

  if (existingUser) return existingUser;

  // Create new user
  const { data: newUser, error } = await supabase
    .from('users')
    .insert({
      clerk_id: clerkId,
      email,
      name,
    })
    .select()
    .single();

  if (error) throw error;
  return newUser;
}
