/**
 * Browser notifications and sound for new chat messages.
 */

let permissionAsked = false

export function requestNotificationPermission() {
  if (!('Notification' in window)) return Promise.resolve(false)
  if (Notification.permission === 'granted') return Promise.resolve(true)
  if (Notification.permission === 'denied') return Promise.resolve(false)
  if (permissionAsked) return Promise.resolve(Notification.permission === 'granted')
  permissionAsked = true
  return Notification.requestPermission().then(p => p === 'granted')
}

export function showMessageNotification(senderName, content) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return
  if (document.hasFocus()) return
  try {
    new Notification(`New message from ${senderName}`, {
      body: content?.slice(0, 100) || 'New message',
      icon: '/prolink-logo.png',
    })
  } catch {}
}

export function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 800
    osc.type = 'sine'
    gain.gain.setValueAtTime(0.25, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.15)
  } catch {}
}
