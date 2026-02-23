import React, { useState } from 'react';
import { useNotify, useRedirect, Title } from 'react-admin';
import {
  Card, CardContent, Button, TextField, MenuItem,
  Box, Typography, CircularProgress} from '@mui/material';
import { Grid } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';
import { newsletterApi } from '../../api/resources';
import { newsletterTemplates } from './templates/index';

// ─── Utilitário puro ──────────────────────────────────────────────────────────

function fillTemplate(html: string, variables: Record<string, string>): string {
  return Object.entries(variables).reduce(
    (acc, [key, value]) => acc.replace(new RegExp(`{{${key}}}`, 'g'), value ?? ''),
    html,
  );
}

// ─── Componente ───────────────────────────────────────────────────────────────

export const NewsletterSend = () => {
  const [templateKey, setTemplateKey] = useState('');
  const [subject, setSubject] = useState('');
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const notify = useNotify();
  const redirect = useRedirect();

  const handleTemplateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.value;
    const template = (newsletterTemplates as any)[key];
    setTemplateKey(key);
    setSubject(template.subject);
    setVariables(
      Object.fromEntries((template.requiredFields as string[]).map((f) => [f, ''])),
    );
  };

  const handleVariableChange = (field: string, value: string) =>
    setVariables((prev) => ({ ...prev, [field]: value }));

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await newsletterApi.uploadImage(file);
      handleVariableChange(fieldName, url);
      notify('Imagem carregada com sucesso!', { type: 'success' });
    } catch (err: unknown) {
      notify(err instanceof Error ? err.message : 'Erro no upload', { type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateKey) return;
    const finalHtml = fillTemplate((newsletterTemplates as any)[templateKey].content, variables);
    setLoading(true);
    try {
      await newsletterApi.broadcast({ subject, message: finalHtml });
      notify('Newsletter enviada com sucesso!', { type: 'success' });
      redirect('/newsletter');
    } catch (err: unknown) {
      notify(err instanceof Error ? err.message : 'Erro ao enviar', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const isImageField = (field: string) => field.includes('imagem');
  const isMultiline = (field: string) =>
    field.includes('descricao') || field.includes('texto') || field.includes('resolvido');

  return (
    <Card sx={{ mt: 3, mb: 5, maxWidth: 900, mx: 'auto', borderRadius: '1rem' }}>
      <Title title="Nova Campanha" />
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 800, color: '#211111', mb: 3 }}>
          🚀 Disparar Newsletter <span style={{ color: '#ea2a33' }}>MilVendas</span>
        </Typography>

        <Box component="form" onSubmit={handleSend} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            select label="Tipo de Comunicação" value={templateKey}
            onChange={handleTemplateChange} fullWidth required
            helperText="Selecione o objetivo da newsletter"
          >
            {Object.entries(newsletterTemplates).map(([key, t]: [string, any]) => (
              <MenuItem key={key} value={key}>{t.label}</MenuItem>
            ))}
          </TextField>

          {templateKey && (
            <>
              <TextField
                label="Assunto do E-mail" value={subject}
                onChange={(e) => setSubject(e.target.value)} fullWidth required
              />

              <Typography variant="subtitle2" sx={{ color: '#64748b', mt: 1, textTransform: 'uppercase', letterSpacing: 1 }}>
                Dados do Template
              </Typography>

              <Grid container spacing={2}>
                {Object.keys(variables).map((field) => (
                  <Grid size={12} key={field}>
                    {isImageField(field) ? (
                      <Box sx={{ p: 3, border: '2px dashed #e2e8f0', borderRadius: '1rem', bgcolor: '#f8fafc', textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ mb: 2, fontWeight: 'bold' }}>
                           {field.replace(/_/g, ' ').toUpperCase()}
                        </Typography>
                        <Button
                          variant="contained" component="label" disabled={uploading}
                          startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
                          sx={{ bgcolor: '#211111', '&:hover': { bgcolor: '#000' } }}
                        >
                          {uploading ? 'A enviar...' : 'Carregar Imagem'}
                          <input type="file" hidden accept="image/*" onChange={(e) => handleFileUpload(e, field)} />
                        </Button>
                        {variables[field] && (
                          <Box sx={{ mt: 2 }}>
                            <img src={variables[field]} alt="Preview" style={{ height: 80, borderRadius: 8, border: '1px solid #ddd' }} />
                            <Typography variant="caption" display="block" color="success.main">URL gerada com sucesso</Typography>
                          </Box>
                        )}
                      </Box>
                    ) : (
                      <TextField
                        label={field.replace(/_/g, ' ').toUpperCase()}
                        value={variables[field]}
                        onChange={(e) => handleVariableChange(field, e.target.value)}
                        fullWidth required
                        multiline={isMultiline(field)}
                        rows={field.includes('descricao') ? 4 : 1}
                        placeholder={`Insira o conteúdo para ${field}`}
                      />
                    )}
                  </Grid>
                ))}
              </Grid>

              <Button
                type="submit" variant="contained" size="large"
                disabled={loading || uploading} startIcon={<SendIcon />}
                sx={{ bgcolor: '#ea2a33', '&:hover': { bgcolor: '#d3272e' }, py: 2, fontWeight: 'bold', mt: 2 }}
              >
                {loading ? 'A enviar...' : 'Enviar Newsletter Agora'}
              </Button>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};