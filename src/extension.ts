import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('chapter-jumper.moveNextQuarter', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const document = editor.document;
        const fullText = document.getText();
        const cursorOffset = document.offsetAt(editor.selection.active);

        // 1. 설정에서 사용자가 지정한 정규식 가져오기
        const config = vscode.workspace.getConfiguration('chapterNavigator');
        const patternString = config.get<string>('chapterPattern') || "^제\\s*\\d+\\s*장";

        // 새로 추가: 분할 수 (기본값 4)
        const quarters = config.get<number>('quarters') || 4;
        if (quarters < 2) {
            vscode.window.showErrorMessage("quarters 설정값은 2 이상이어야 합니다.");
            return;
        }

        let chapterRegex: RegExp;
        try {
            chapterRegex = new RegExp(patternString, 'gm');
        } catch (e: unknown) {
            // 에러 타입 처리 (TS18046 해결)
            const errorMessage = e instanceof Error ? e.message : String(e);
            vscode.window.showErrorMessage("잘못된 정규표현식 설정입니다: " + errorMessage);
            return;
        }

        let chapters: number[] = [];
        let match: RegExpExecArray | null;
        while ((match = chapterRegex.exec(fullText)) !== null) {
            chapters.push(match.index);
        }

        if (chapters.length === 0) {
            vscode.window.showInformationMessage("설정된 패턴과 일치하는 장을 찾을 수 없습니다.");
            return;
        }

        // 2. 현재 위치 기준 장 시작점/끝점 계산
        let currentChapterStart = 0;
        let nextChapterStart = fullText.length;

        for (let i = 0; i < chapters.length; i++) {
            if (chapters[i] <= cursorOffset) {
                currentChapterStart = chapters[i];
                nextChapterStart = chapters[i + 1] ?? fullText.length;
            } else {
                break;
            }
        }

        const chapterLength = nextChapterStart - currentChapterStart;
        const segmentSize = chapterLength / quarters; // 한 구간당 길이
        
        // 3. 이동 목표 지점 동적 생성 (1/N, 2/N, ..., (N-1)/N, 장 끝)
        const targets: number[] = [];
        for (let i = 1; i < quarters; i++) {
            targets.push(Math.floor(currentChapterStart + segmentSize * i));
        }
        targets.push(nextChapterStart); // 장 끝도 포함

        // 4. 현재 커서보다 약간 뒤(5 이상)인 첫 번째 목표 지점 찾기
        const minAdvance = 200;
        let targetOffset = targets.find(t => t > cursorOffset + minAdvance);
        if (targetOffset === undefined) {
            targetOffset = Math.min(cursorOffset + minAdvance, nextChapterStart);
        }

        if (targetOffset !== undefined) {
            const newPosition = document.positionAt(targetOffset);
            editor.selection = new vscode.Selection(newPosition, newPosition);
            editor.revealRange(new vscode.Range(newPosition, newPosition), vscode.TextEditorRevealType.InCenter);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}