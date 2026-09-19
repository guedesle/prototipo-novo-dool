export const edition = {
  publication: 'Diário Oficial do Estado',
  title: 'Sumário da edição',
  edition: 'Edição demonstrativa',
  date: '19 de setembro de 2026',
  tree: [
    {
      id: 'executivo',
      type: 'dimension',
      dimension: 'Caderno',
      label: 'Executivo',
      children: [
        {
          id: 'saeb',
          type: 'dimension',
          dimension: 'Órgão',
          label: 'Secretaria da Administração',
          children: [
            {
              id: 'gab-saeb',
              type: 'dimension',
              dimension: 'Unidade',
              label: 'Gabinete do Secretário',
              children: [
                {
                  id: 'portarias-saeb',
                  type: 'dimension',
                  dimension: 'Tipo',
                  label: 'Portarias',
                  children: [
                    {
                      id: 'ato-001',
                      type: 'fact',
                      ref: 'Portaria 123/2026',
                      title: 'Dispõe sobre procedimentos administrativos no âmbito da Secretaria da Administração.',
                      href: '#ato-001',
                      meta: ['p. 12', '18/09/2026'],
                      formats: [
                        { label: 'HTML', href: '#ato-001' },
                        { label: 'PDF', href: '#ato-001-pdf' }
                      ]
                    },
                    {
                      id: 'ato-002',
                      type: 'fact',
                      ref: 'Portaria 124/2026',
                      title: 'Designa servidores para composição de grupo de trabalho e estabelece suas atribuições.',
                      href: '#ato-002',
                      meta: ['p. 13', '18/09/2026']
                    }
                  ]
                },
                {
                  id: 'despachos-saeb',
                  type: 'dimension',
                  dimension: 'Tipo',
                  label: 'Despachos',
                  children: [
                    {
                      id: 'ato-003',
                      type: 'fact',
                      ref: 'Despacho 18/09/2026',
                      title: 'Despacho referente a processo administrativo eletrônico.',
                      href: '#ato-003',
                      meta: ['p. 14']
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 'sefaz',
          type: 'dimension',
          dimension: 'Órgão',
          label: 'Secretaria da Fazenda',
          children: [
            {
              id: 'sat',
              type: 'dimension',
              dimension: 'Unidade',
              label: 'Superintendência de Administração Tributária',
              children: [
                {
                  id: 'ditri',
                  type: 'dimension',
                  dimension: 'Diretoria',
                  label: 'Diretoria de Tributação',
                  children: [
                    {
                      id: 'in-sefaz',
                      type: 'dimension',
                      dimension: 'Tipo',
                      label: 'Instruções normativas',
                      children: [
                        {
                          id: 'ato-004',
                          type: 'fact',
                          ref: 'IN 45/2026',
                          title: 'Estabelece procedimentos complementares para cumprimento de obrigação tributária.',
                          href: '#ato-004',
                          meta: ['p. 21']
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'licitacoes',
      type: 'dimension',
      dimension: 'Caderno',
      label: 'Licitações',
      expanded: false,
      children: [
        {
          id: 'sesab',
          type: 'dimension',
          dimension: 'Órgão',
          label: 'Secretaria da Saúde',
          children: [
            {
              id: 'avisos-sesab',
              type: 'dimension',
              dimension: 'Tipo',
              label: 'Avisos de licitação',
              children: [
                {
                  id: 'ato-005',
                  type: 'fact',
                  ref: 'PE 091/2026',
                  title: 'Aviso de licitação para aquisição de equipamentos hospitalares.',
                  href: '#ato-005',
                  meta: ['p. 1']
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
