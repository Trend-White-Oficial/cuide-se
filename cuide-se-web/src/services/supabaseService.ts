import { supabase } from '../config/supabase'

export const supabaseService = {
  // Função para criar uma nova nota
  async createNote(title: string) {
    const { data, error } = await supabase
      .from('notes')
      .insert([{ title }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Função para listar todas as notas
  async listNotes() {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Função para atualizar uma nota
  async updateNote(id: number, title: string) {
    const { data, error } = await supabase
      .from('notes')
      .update({ title })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Função para deletar uma nota
  async deleteNote(id: number) {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}
