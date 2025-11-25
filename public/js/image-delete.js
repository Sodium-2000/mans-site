document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.image-delete-btn');
    if (!btn) return;

    const confirmed = confirm(btn.dataset.confirmMessage || 'هل أنت متأكد أنك تريد حذف هذه الصورة؟');
    if (!confirmed) return;

    const endpoint = btn.dataset.endpoint;
    if (!endpoint) {
        alert('تعذر تحديد مسار الحذف');
        return;
    }

    try {
        btn.disabled = true;
        const res = await fetch(endpoint, { method: 'DELETE', headers: { 'Accept': 'application/json' } });
        if (!res.ok) {
            const json = await res.json().catch(() => ({}));
            alert(json.error || 'حدث خطأ أثناء حذف الصورة');
            btn.disabled = false;
            return;
        }
        // remove the image container from DOM
        const item = btn.closest('.image-item');
        if (item) item.remove();
    } catch (err) {
        console.error(err);
        alert('خطأ في الاتصال بالخادم');
        btn.disabled = false;
    }
});
