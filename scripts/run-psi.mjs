async function runPSI() {
    const url = 'https://elevamex.com/blog/guia-costos-mantenimiento-elevadores-cdmx';
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&strategy=mobile`;
    try {
        const res = await fetch(apiUrl);
        const data = await res.json();
        if (data.error) {
            console.error('API Error:', data.error.message);
            return;
        }
        if (!data.lighthouseResult) {
            console.log('No lighthouseResult:', data);
            return;
        }
        const c = data.lighthouseResult.categories;
        console.log('Performance:', c.performance.score * 100);
        console.log('Accessibility:', c.accessibility.score * 100);
        console.log('Best Practices:', c['best-practices'].score * 100);
        console.log('SEO:', c.seo.score * 100);
    } catch (err) {
        console.error('Fetch error:', err);
    }
}
runPSI();
