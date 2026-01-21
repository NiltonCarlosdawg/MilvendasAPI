import React, { useState } from 'react';
import { useNotify, useRedirect, Title } from 'react-admin';
import { 
    Card, 
    CardContent, 
    Button, 
    TextField, 
    MenuItem, 
    Box, 
    Typography, 
    CircularProgress 
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';
import { newsletterTemplates } from './templates';

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
        const template = newsletterTemplates[key as keyof typeof newsletterTemplates];
        setSubject(template.subject);
        
        // Inicializa os campos necessários para este template
        const initialVars: Record<string, string> = {};
        template.requiredFields.forEach(field => {
            initialVars[field] = '';
        });
        setVariables(initialVars);
    };

    const handleVariableChange = (field: string, value: string) => {
        setVariables(prev => ({ ...prev, [field]: value }));
    };

    // FUNÇÃO PARA CARREGAR IMAGEM LOCAL
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/v1/newsletter/upload-image', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                handleVariableChange(fieldName, data.url);
                notify('Imagem local carregada com sucesso!', { type: 'success' });
            } else {
                throw new Error(data.error);
            }
        } catch (err: any) {
            notify(err.message || 'Erro no upload', { type: 'error' });
        } finally {
            setUploading(false);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // 1. Pega no conteúdo bruto do template selecionado
        let finalHtml = newsletterTemplates[templateKey as keyof typeof newsletterTemplates].content;

        // 2. Substitui as variáveis {{campo}} pelos valores (incluindo as URLs das imagens)
        Object.entries(variables).forEach(([key, value]) => {
            // Expressão regular para substituir todas as ocorrências
            const regex = new RegExp(`{{${key}}}`, 'g');
            finalHtml = finalHtml.replace(regex, value);
        });

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/v1/newsletter/broadcast', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ subject, message: finalHtml })
            });

            if (response.ok) {
                notify('Newsletter disparada com sucesso!', { type: 'success' });
                redirect('/newsletter');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao enviar');
            }
        } catch (err: any) {
            notify(err.message, { type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card sx={{ mt: 3, maxWidth: 800, mx: 'auto' }}>
            <Title title="Enviar Newsletter" />
            <CardContent>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#ea2a33' }}>
                    Nova Campanha de E-mail
                </Typography>
                
                <Box component="form" onSubmit={handleSend} sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
                    <TextField
                        select
                        label="Escolha o Template de Design"
                        value={templateKey}
                        onChange={handleTemplateChange}
                        fullWidth
                        required
                    >
                        {Object.entries(newsletterTemplates).map(([key, t]) => (
                            <MenuItem key={key} value={key}>{t.label}</MenuItem>
                        ))}
                    </TextField>

                    {templateKey && (
                        <>
                            <TextField 
                                label="Assunto do E-mail" 
                                value={subject} 
                                onChange={e => setSubject(e.target.value)} 
                                fullWidth 
                                required
                            />

                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
                                Conteúdo do Template:
                            </Typography>

                            {Object.keys(variables).map((field) => (
                                <Box key={field}>
                                    {/* SE O CAMPO FOR DE IMAGEM, MOSTRA UPLOAD */}
                                    {field.includes('imagem') ? (
                                        <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 2, bgcolor: '#f9f9f9' }}>
                                            <Typography variant="body2" gutterBottom>
                                                {field.replace('_', ' ').toUpperCase()} (Upload Local)
                                            </Typography>
                                            <Button
                                                variant="outlined"
                                                component="label"
                                                startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                                                disabled={uploading}
                                            >
                                                {uploading ? 'A Carregar...' : 'Selecionar Imagem'}
                                                <input type="file" hidden accept="image/*" onChange={e => handleFileUpload(e, field)} />
                                            </Button>
                                            {variables[field] && (
                                                <Typography variant="caption" display="block" sx={{ mt: 1, color: 'green' }}>
                                                    ✓ Imagem pronta: {variables[field].split('/').pop()}
                                                </Typography>
                                            )}
                                        </Box>
                                    ) : (
                                        <TextField
                                            label={field.replace('_', ' ').toUpperCase()}
                                            value={variables[field]}
                                            onChange={e => handleVariableChange(field, e.target.value)}
                                            fullWidth
                                            multiline={field.includes('descricao') || field.includes('paragrafo')}
                                            rows={3}
                                            required
                                        />
                                    )}
                                </Box>
                            ))}

                            <Button 
                                type="submit" 
                                variant="contained" 
                                size="large"
                                disabled={loading || uploading}
                                startIcon={<SendIcon />}
                                sx={{ bgcolor: '#ea2a33', '&:hover': { bgcolor: '#d3272e' }, py: 1.5 }}
                            >
                                {loading ? 'A processar envio...' : 'Disparar Newsletter'}
                            </Button>
                        </>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};