<script lang="ts">
  import { onMount } from 'svelte';

  interface DatasetInput {
    label: string;
    values: number[];
    color: string;
  }

  interface Props {
    data: {
      labels: string[];
      datasets: DatasetInput[];
    };
    title: string;
  }

  let { data, title }: Props = $props();
  let canvas: HTMLCanvasElement;
  let chartInstance: any = null;

  onMount(async () => {
    const {
      Chart,
      BarController,
      CategoryScale,
      LinearScale,
      BarElement,
      Tooltip,
      Legend,
    } = await import('chart.js');

    Chart.register(BarController, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

    const textColor = '#94a3b8';
    const gridColor = '#334155';

    chartInstance = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: data.datasets.map((ds) => ({
          label: ds.label,
          data: ds.values,
          backgroundColor: ds.color + '99',
          borderColor: ds.color,
          borderWidth: 1,
          borderRadius: 4,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        animation: {
          duration: 800,
          easing: 'easeOutQuart',
        },
        plugins: {
          legend: {
            labels: { color: textColor, font: { family: 'Inter, system-ui, sans-serif' } },
          },
          tooltip: {
            backgroundColor: '#1e293b',
            titleColor: '#e2e8f0',
            bodyColor: '#94a3b8',
            borderColor: '#475569',
            borderWidth: 1,
          },
        },
        scales: {
          x: {
            ticks: { color: textColor },
            grid: { color: gridColor },
          },
          y: {
            ticks: { color: textColor },
            grid: { color: gridColor },
          },
        },
      },
    });

    return () => {
      chartInstance?.destroy();
    };
  });
</script>

<figure class="my-8 not-prose">
  <figcaption class="text-center font-semibold text-slate-900 dark:text-white mb-4">
    {title}
  </figcaption>
  <div class="bg-white dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
    <canvas bind:this={canvas} class="w-full max-h-[400px]"></canvas>
  </div>
</figure>
