import React, { useState } from 'react';
import { useNotify, useRedirect, Title } from 'react-admin';
import { 
    Card, CardContent, Button, TextField, MenuItem, 
    Box, Typography, CircularProgress, Grid 
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';
import { newsletterTemplates } from './templates/index';

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
        setTemplateKey(key);
        const template = newsletterTemplates[key];
        setSubject(template.subject);
        
        // Inicializa os campos dinâmicos baseados no template tech selecionado
        const initialVars: Record<string, string> = {};
        template.requiredFields.forEach(field => {
            initialVars[field] = '';
        });
        setVariables(initialVars);
    };

    const handleVariableChange = (field: string, value: string) => {
        setVariables(prev => ({ ...prev, [field]: value }));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://milvendasapi.onrender.com/api/v1/newsletter/upload-image', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                handleVariableChange(fieldName, data.url);
                notify('Imagem carregada no servidor MilVendas!', { type: 'success' });
            } else {
                throw new Error(data.error);
            }
        } catch (err: any) {
            notify('Erro no upload: ' + err.message, { type: 'error' });
        } finally {
            setUploading(false);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!templateKey) return;
        
        setLoading(true);
        let finalHtml = newsletterTemplates[templateKey].content;

        // Substituição inteligente de placeholders
        Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    
    // Se for um campo de imagem, garantimos que a URL está correta
    if (key.includes('imagem')) {
        // Força a imagem a ter um estilo básico de bloco se não tiver
        finalHtml = finalHtml.replace(regex, value);
    } else {
        finalHtml = finalHtml.replace(regex, value || '');
    }
});

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://milvendasapi.onrender.com/api/v1/newsletter/broadcast', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ subject, message: finalHtml })
            });

            if (response.ok) {
                notify('Campanha tecnológica disparada com sucesso!', { type: 'success' });
                redirect('/newsletter');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao processar envio');
            }
        } catch (err: any) {
            notify(err.message, { type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card sx={{ mt: 3, mb: 5, maxWidth: 900, mx: 'auto', borderRadius: '1rem' }}>
            <Title title="Nova Campanha Tech" />
            <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 800, color: '#211111', mb: 3 }}>
                    🚀 Disparar Newsletter <span style={{ color: '#ea2a33' }}>MilVendas</span>
                </Typography>
                
                <Box component="form" onSubmit={handleSend} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                        select
                        label="Tipo de Comunicação"
                        value={templateKey}
                        onChange={handleTemplateChange}
                        fullWidth
                        required
                        helperText="Selecione o objetivo da newsletter"
                    >
                        {Object.entries(newsletterTemplates).map(([key, t]) => (
                            <MenuItem key={key} value={key}>{t.label}</MenuItem>
                        ))}
                    </TextField>

                    {templateKey && (
                        <>
                            <TextField 
                                label="Assunto do E-mail (Subject)" 
                                value={subject} 
                                onChange={e => setSubject(e.target.value)} 
                                fullWidth 
                                required
                            />

                            <Typography variant="subtitle2" sx={{ color: '#64748b', mt: 1, textTransform: 'uppercase', letterSpacing: 1 }}>
                                Dados do Template Selecionado
                            </Typography>

                            <Grid container spacing={2}>
                                {Object.keys(variables).map((field) => (
                                    <Grid item xs={12} key={field}>
                                        {field.includes('imagem') ? (
                                            <Box sx={{ p: 3, border: '2px dashed #e2e8f0', borderRadius: '1rem', bgcolor: '#f8fafc', textAlign: 'center' }}>
                                                <Typography variant="body2" sx={{ mb: 2, fontWeight: 'bold' }}>
                                                    🖼️ {field.replace(/_/g, ' ').toUpperCase()}
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    component="label"
                                                    disabled={uploading}
                                                    startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
                                                    sx={{ bgcolor: '#211111', '&:hover': { bgcolor: '#000' } }}
                                                >
                                                    {uploading ? 'A enviar...' : 'Carregar Ficheiro Local'}
                                                    <input type="file" hidden accept="image/*" onChange={e => handleFileUpload(e, field)} />
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
                                                onChange={e => handleVariableChange(field, e.target.value)}
                                                fullWidth
                                                required
                                                multiline={field.includes('descricao') || field.includes('texto') || field.includes('resolvido')}
                                                rows={field.includes('descricao') ? 4 : 1}
                                                placeholder={`Insira o conteúdo para ${field}`}
                                            />
                                        )}
                                    </Grid>
                                ))}
                            </Grid>

                            <Button 
                                type="submit" 
                                variant="contained" 
                                size="large"
                                disabled={loading || uploading}
                                startIcon={<SendIcon />}
                                sx={{ 
                                    bgcolor: '#ea2a33', 
                                    '&:hover': { bgcolor: '#d3272e' }, 
                                    py: 2, 
                                    fontWeight: 'bold', 
                                    borderRadius: 'full',
                                    mt: 2
                                }}
                            >
                                {loading ? 'A disparar e-mails...' : 'Enviar Newsletter Agora'}
                            </Button>
                        </>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};