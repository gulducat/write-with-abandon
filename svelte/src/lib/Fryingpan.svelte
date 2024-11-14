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
  let secondsLeft = $derived((duration - elapsed) / 1000);
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
    box.style.color = '#fff';
    if (box.value == fire) {
        box.value = '';
    }
  }
  function handleBlur() {
    box.style.color = '#999';
    if (box.value == '') {
      box.value = fire;
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
    bind:this={box}
    bind:value={contents}
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
