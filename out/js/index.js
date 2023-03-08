export default {
    uptimerobot: function () {
        var times = 30;
        if(window.innerWidth <= 600) times = 120;
        return fetch('https://script.google.com/macros/s/AKfycbzX68SWZ9yBbkegxGl3Bw3DmrUk8eEsdqnYqgZfhUmL0jjoDvU/exec?times='+times)
            .then(response => response.json()) // 輸出成 json
    }
}