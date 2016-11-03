define(function(require) {
    var $ = require('jquery')
    var Vue = require('vue')

    return {
        Main: function() {

            var app = new Vue({
                el: '#app',
                template: `
                <div id="ws-handler"></div>

                <input id="in" type="text" @keyup.enter="sendMsg"/>
                <button @click="closeWS">close ws</button>
                <ul id="out" v-for="msg in recv">
                    <li>{{ msg }}</li>
                </ul>
                `,
                data: {
                    recv: [],
                },
                methods: {
                    closeWS: function() {
                        $("#ws-handler").trigger(
                            "close")
                    },
                    sendMsg: function() {
                        var msg = $('#in').val()
                        $('#in').val('')
                        if (msg) {
                            $('#ws-handler').trigger(
                                'send', msg)
                        }
                    }
                }
            })

            var ws = new WebSocket("ws://localhost:9000/ws")
            ws.onopen = function() {
                console.log('websocket open');
                $('#ws-handler').on('send', function(event, msg) {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(msg)
                    } else {
                        console.log('ws closed');
                    }
                })
                $('#ws-handler').on('close', function() {
                    ws.close()
                })

            }

            ws.onclose = function() {
                console.log('websocket close');
            }

            ws.onerror = function(err) {
                console.log('websocket err: ' + err);
                ws.close()
            }

            ws.onmessage = function(msg) {
                app.$data.recv.push(msg.data)
            }


        }
    }
})
