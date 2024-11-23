<script lang="ts">

// aren't mutable globals the best?
const root = document.querySelector(':root') // i'm a naughty component
const media = window.matchMedia('(prefers-color-scheme: dark)')
const preferDark = () => { return media.matches }

let scheme = localStorage.getItem('scheme') || 'auto'
let next = $state(getNext(scheme))
setScheme(scheme)

function setScheme(to: string) {
  next = getNext(to)
  console.log('setting scheme from='+scheme+' to='+to+' next='+next)
  scheme = to
  localStorage.setItem('scheme', to)
  if (to == 'auto') {
    preferDark() ? to = 'dark auto' : to = 'light auto'
  }
  if (root) root.className = to 
}

function getNext(s: string) {
  let butts: {[key: string]: string} = {
    'auto': preferDark() ? 'light' : 'dark',
    'light': preferDark() ? 'dark' : 'auto',
    'dark': preferDark() ? 'auto': 'light',
  }
  return butts[s]
}

media.addEventListener('change', event => {
  if (scheme == 'auto') setScheme('auto')
})

function toggleScheme(){
  setScheme(next)
}
</script>

<style>
button {
  cursor: pointer;
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 50%;
  border: solid 2px var(--bg-color);
  background-color: var(--button-color);
  transition: border 0.3s ease-in-out;
}
button:hover {
  border: var(--button-border);
  transition: border 0.2s ease-out;
}
</style>

<button
  title="set color scheme: {next}"
  aria-label="toggle dark mode"
  onclick={toggleScheme}
></button>
