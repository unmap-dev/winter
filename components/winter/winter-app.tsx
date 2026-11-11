"use client";

import { useCallback, useEffect, useState } from "react";
import { MountainSnowIcon } from "lucide-react";
import { SkiResortExplorer } from "@/components/ui/ski-resort-explorer";
import { Toggle } from "@/components/ui/toggle";
import { AppHeader } from "@/lib/kit/app-header";
import { API_KEY, GATEWAY } from "@/lib/kit/config";
import { MissingKey } from "@/lib/kit/missing-key";
import { useLang } from "@/lib/kit/use-lang";
import { MANIFEST } from "@/lib/manifest";
import { TEXT } from "@/lib/text";
import { parseState, writeState, type WinterState } from "@/lib/url";

/** The area on screen and the 3D lifts switch, kept in the query string so a link opens on them. */
function useWinterState(): [WinterState, (next: Partial<WinterState>) => void] {
  const [state, setState] = useState<WinterState>({ area: null, lifts3d: false });
  useEffect(() => {
    // The URL only exists after mount in a static export.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(parseState(window.location.search));
  }, []);
  const update = useCallback((next: Partial<WinterState>) => {
    setState((current) => {
      const merged = { ...current, ...next };
      window.history.replaceState(window.history.state, "", `${window.location.pathname}${writeState(window.location.search, merged)}`);
      return merged;
    });
  }, []);
  return [state, update];
}

/**
 * Winter: the ski-resort-explorer block, full-bleed under the app header, with the page's language,
 * the picked area and the 3D lifts switch in the URL. Everything else (the list, the filters, the
 * area panel, the add-on gate, the OpenStreetMap credit and the disclaimer) is the block's own.
 */
export function WinterApp() {
  const [lang, setLang] = useLang();
  const [state, update] = useWinterState();
  const t = TEXT[lang];
  const onAreaChange = useCallback((area: string | null) => update({ area }), [update]);

  return (
    <div className="flex h-dvh flex-col">
      <AppHeader
        manifest={MANIFEST}
        lang={lang}
        onLang={setLang}
        actions={
          API_KEY ? (
            <Toggle
              variant="outline"
              size="sm"
              pressed={state.lifts3d}
              onPressedChange={(pressed: boolean) => update({ lifts3d: pressed })}
              title={t.lifts3dHint}
              data-lifts3d-toggle=""
            >
              <MountainSnowIcon data-icon="inline-start" />
              {t.lifts3d}
            </Toggle>
          ) : null
        }
      />
      <main className="min-h-0 flex-1">
        {API_KEY ? (
          <SkiResortExplorer
            apiKey={API_KEY}
            gateway={GATEWAY}
            lang={lang}
            lifts3d={state.lifts3d}
            area={state.area}
            onAreaChange={onAreaChange}
            className="h-full"
          />
        ) : (
          <MissingKey lang={lang} />
        )}
      </main>
    </div>
  );
}
