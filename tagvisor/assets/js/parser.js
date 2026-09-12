class TagParser {
    constructor(htmlString) {
        this.html = htmlString;
        this.parser = new DOMParser();
        this.doc = this.parser.parseFromString(this.html, 'text/html');
    }

    isHtmlDocument() {
        // Vérifie si le fichier contient une structure HTML minimale (DOCTYPE ou balise html)
        const hasHtmlTag = !!this.doc.querySelector('html');
        const hasDoctype = this.html.toLowerCase().includes('<!doctype');
        return hasHtmlTag || hasDoctype;
    }

    analyze() {
        if (!this.isHtmlDocument()) {
            // Fichier non-HTML (script back-end, API, données pures) : on renvoie un état neutre
            return {
                isHtml: false,
                title: { text: 'Script Back-end (Non soumis au SEO)', length: 0, status: 'neutral', message: 'Ignoré' },
                description: { text: 'Non applicable pour ce type de fichier', length: 0, status: 'neutral', message: 'Ignorée' },
                viewport: { present: false, content: null },
                lang: { present: false, lang: 'Non applicable' },
                headings: { total: 0, counts: { h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 }, list: [] },
                images: { total: 0, missingAlt: 0 },
                canonical: { present: false, href: null },
                score: 100 // Score neutre non pénalisant pour les scripts techniques
            };
        }

        const results = {
            isHtml: true,
            title: this.analyzeTitle(),
            description: this.analyzeDescription(),
            viewport: this.analyzeViewport(),
            lang: this.analyzeLang(),
            headings: this.analyzeHeadings(),
            images: this.analyzeImages(),
            canonical: this.analyzeCanonical(),
            score: 0
        };

        results.score = this.computeScore(results);
        return results;
    }

    analyzeTitle() {
        const titleEl = this.doc.querySelector('title');
        const text = titleEl ? titleEl.textContent.trim() : '';
        const length = text.length;
        
        let status = 'success';
        let message = `${length} car. (Optimal)`;

        if (length === 0) {
            status = 'error';
            message = 'Manquant';
        } else if (length < 30) {
            status = 'warning';
            message = `${length} car. (Trop court)`;
        } else if (length > 60) {
            status = 'warning';
            message = `${length} car. (Trop long)`;
        }

        return { text: text || 'Aucun titre défini', length, status, message };
    }

    analyzeDescription() {
        const descEl = this.doc.querySelector('meta[name="description"]');
        const content = descEl ? descEl.getAttribute('content') || '' : '';
        const length = content.length;

        let status = 'success';
        let message = `${length} car. (Optimal)`;

        if (length === 0) {
            status = 'error';
            message = 'Manquante';
        } else if (length < 70) {
            status = 'warning';
            message = `${length} car. (Trop courte)`;
        } else if (length > 160) {
            status = 'warning';
            message = `${length} car. (Trop longue)`;
        }

        return { text: content || 'Aucune description définie', length, status, message };
    }

    analyzeViewport() {
        const viewport = this.doc.querySelector('meta[name="viewport"]');
        return {
            present: !!viewport,
            content: viewport ? viewport.getAttribute('content') : null
        };
    }

    analyzeLang() {
        const htmlTag = this.doc.querySelector('html');
        const lang = htmlTag ? htmlTag.getAttribute('lang') : null;
        return {
            present: !!lang,
            lang: lang || 'Non défini'
        };
    }

    analyzeHeadings() {
        const headings = Array.from(this.doc.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        const counts = { h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 };
        
        headings.forEach(h => {
            const tagName = h.tagName.toLowerCase();
            if (counts[tagName] !== undefined) {
                counts[tagName]++;
            }
        });

        return {
            total: headings.length,
            counts,
            list: headings.map(h => ({ tag: h.tagName.toLowerCase(), text: h.textContent.trim() }))
        };
    }

    analyzeImages() {
        const images = Array.from(this.doc.querySelectorAll('img'));
        let missingAlt = 0;
        
        images.forEach(img => {
            if (!img.hasAttribute('alt') || img.getAttribute('alt').trim() === '') {
                missingAlt++;
            }
        });

        return {
            total: images.length,
            missingAlt
        };
    }

    analyzeCanonical() {
        const canonical = this.doc.querySelector('link[rel="canonical"]');
        return {
            present: !!canonical,
            href: canonical ? canonical.getAttribute('href') : null
        };
    }

    computeScore(res) {
        let score = 100;
        if (res.title.status === 'error') score -= 25;
        else if (res.title.status === 'warning') score -= 10;

        if (res.description.status === 'error') score -= 25;
        else if (res.description.status === 'warning') score -= 10;

        if (!res.viewport.present) score -= 15;
        if (!res.lang.present) score -= 10;
        if (res.headings.counts.h1 !== 1) score -= 15;
        if (res.images.missingAlt > 0) score -= (res.images.missingAlt * 5);
        if (!res.canonical.present) score -= 10;

        return Math.max(0, score);
    }
}