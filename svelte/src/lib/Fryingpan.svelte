<!-- https://svelte.dev/playground/7guis-timer?version=5.1.16 -->

<!-- https://eugenkiss.github.io/7guis/tasks#timer -->

<script>
	import { onMount } from 'svelte';

  /**
     * @type {HTMLTextAreaElement}
     */
  let box;

  const fire = '🔥';
  let contents = $state('');
  let wc = $state(0);
  
  const dsecs = localStorage['secs'] || 2
	let duration = $state(dsecs*1000);
  let seconds = $derived(duration / 1000)
	let elapsed = $state(dsecs*1000);
  let progress = $derived(1-elapsed / duration);

	onMount(() => {
		let last_time = performance.now();

		let frame = requestAnimationFrame(function update(time) {
			frame = requestAnimationFrame(update);

			elapsed += Math.min(
        time - last_time,
        duration - elapsed);

      if (progress <= 0 && contents != fire && contents != '') {
        contents = fire;
      }

			last_time = time;
		});

    box.focus();

		return () => {
			cancelAnimationFrame(frame);
		};
	});

  /**
     * @param {string} s 
     */
  function countWords(s) {
    let t = s.trim()
    if (t == '') {
      return 0;
    }
  	return t.split(/\s+/).length;
  }

  function handleInput() {
    elapsed = 0;
    wc = countWords(box.value);
    localStorage['secs'] = duration / 1000;
  }

  function handleFocus() {
    if (box.value == fire) {
        box.value = '';
    }
  }
  function handleBlur() {
    if (box.value == '') {
      box.value = fire;
    }
  }

</script>

<style>
.oven {
  width: 30em;
}

progress {
  width: 20em;
}

textarea {
  width: 25em;
  height: 10em;

  border-radius: 8px;
  border: 1px solid #646cff;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-family: inherit;
  transition: border-color 0.25s;
}

.slider input,
.slider span {
  display: inline-block;
  vertical-align: middle;
}
</style>

<div class='oven'>

  <progress value={progress}></progress>
  
  <textarea
    bind:this={box}
    bind:value={contents}
    oninput={handleInput}
    onfocus={handleFocus}
    onblur={handleBlur}
    spellcheck="false"
  ></textarea>
  
  <div class='slider'>
    <input type='range' min=1000 max=30000 step=1000
      bind:value={duration}
      onchange={handleInput}
      />
    <span>{seconds}s</span>
  </div>

</div>
