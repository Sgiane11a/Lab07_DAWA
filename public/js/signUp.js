document.addEventListener('DOMContentLoaded', () => {
    const datepickerElems = document.querySelectorAll('.datepicker');
    M.Datepicker.init(datepickerElems, {
        format: 'yyyy-mm-dd',
        autoClose: true,
        yearRange: [1950, new Date().getFullYear() - 14],
        i18n: {
            cancel: 'Cancelar',
            clear: 'Limpiar',
            done: 'Ok',
            months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            weekdays: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
            weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
            weekdaysAbbrev: ['D', 'L', 'M', 'M', 'J', 'V', 'S']
        }
    });

    const form = document.getElementById('signUpForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
                
        M.toast({ html: 'Registrando usuario...', classes: 'rounded' });

        try {
            const response = await fetch('/api/auth/signUp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                M.toast({ html: '¡Usuario registrado con éxito!', classes: 'rounded green' });
                setTimeout(() => {
                    window.location.href = '/signIn';
                }, 1500);
            } else {
                M.toast({ html: `Error: ${result.message}`, classes: 'rounded red' });
            }

        } catch (error) {
            console.error('Error en el fetch de registro:', error);
            M.toast({ html: 'Ocurrió un error al intentar registrarse.', classes: 'rounded red' });
        }
    });
});