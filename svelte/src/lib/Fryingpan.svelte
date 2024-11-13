<!-- https://svelte.dev/playground/7guis-timer?version=5.1.16 -->

<!-- https://eugenkiss.github.io/7guis/tasks#timer -->

<script>
	import { onMount } from 'svelte';

  const prompt = 'scream at the void';
  const fire = '🔥';
  let box = $state(prompt);
  let wc = $state(0);
  
  const dsecs = 2;
	let duration = $state(dsecs*1000);
  let seconds = $derived(duration / 1000)
	let elapsed = $state(dsecs*1000);
  let secondsLeft = $derived((duration - elapsed) / 1000);
  let progress = $derived(1-elapsed / duration);

	onMount(() => {
		let last_time = performance.now();

		let frame = requestAnimationFrame(function update(time) {
			frame = requestAnimationFrame(update);

			elapsed += Math.min(
        time - last_time,
        duration - elapsed);

      if (progress <= 0 && box != fire) {
        box = fire;
      }

			last_time = time;
		});

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

  function handleInput(e) {
    elapsed = 0;
    wc = countWords(e.target.value);
  }

  function handleFocus(e) {
    switch (e.target.value) {
      case prompt:
      case fire:
        e.target.value = '';
        break;
    }
  }
  function handleBlur(e) {
    if (e.target.value == '') {
      e.target.value = prompt;
    }
  }

</script>

<span>
	<progress value={progress}></progress>
  {secondsLeft.toFixed(1)}s
  | words: {wc}
</span>

<div class='card'>
  <textarea 
    bind:value={box}
    oninput={handleInput}
    onfocus={handleFocus}
    onblur={handleBlur}
  ></textarea>
</div>


<label>
	duration:
	<input type="range" min=1000 max=30000 step=1000
    bind:value={duration}
    onchange={handleInput}
    />
  {seconds}s
</label>
