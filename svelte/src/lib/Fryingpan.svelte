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

  const secs = localStorage['secs'] || 2
  let duration = $state(secs*1000);
  let seconds = $derived(duration / 1000)
  let elapsed = $state(secs*1000);
  let progress = $derived(1-elapsed / duration);

  onMount(() => {
    box.focus();

    box.style['width'] = localStorage['width'] || '25rem';
    box.style['height'] = localStorage['height'] || '10rem';
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        localStorage['width'] = entry.contentRect.width+'px';
        localStorage['height'] = entry.contentRect.height+'px';
      }
    });
    resizeObserver.observe(box);

    let last_time = performance.now();
    let frame = requestAnimationFrame(function update(time) {
      frame = requestAnimationFrame(update);

      elapsed += Math.min(time-last_time, duration-elapsed);
      if (progress <= 0 && contents != fire && contents != '') {
        contents = fire;
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

  function handleInput() {
    elapsed = -1000; // pause a sec before countdown
    wc = countWords(box.value);
    localStorage['secs'] = duration / 1000;
  }

  function handleFocus() {
    if (box?.value == fire) {
        box.value = '';
    }
  }

</script>

<style>
progress {
  width: 25em;
  height: 0.5em;
  margin-bottom: 7px;
}

#slider {
  float: left;
  vertical-align: middle;
  margin-left: 1em;
}
#slider input {
  width: 10rem;
}
#slider span {
  float: right;
  margin-left: 8px;
}
@-moz-document url-prefix() {
  #slider span {
    margin-top: 4px;
  }
}
#wordcount {
  float: right;
  text-align: right;
  margin-right: 1em;
}
</style>

<div class='oven'>

  <div>
    <progress value={progress}></progress>
  </div>

  <textarea
    name="void"
    bind:this={box}
    bind:value={contents}
    oninput={handleInput}
    onfocus={handleFocus}
    spellcheck="false"
  ></textarea>

  <div>
    <span id='wordcount'>{wc} words</span>
    <div id='slider'>
      <input type='range' min=1000 max=29000 step=1000
        bind:value={duration}
        onchange={handleInput}
      />
      <span>{seconds+1}s</span>
    </div>
  </div>

</div>
